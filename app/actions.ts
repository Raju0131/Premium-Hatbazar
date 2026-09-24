"use server"

import { revalidatePath } from "next/cache"
import { CartItem } from "@/lib/types"
import { Prisma, OrderStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export async function submitOrder(data: {
  customerName: string;
  phone: string;
  email: string;
  paymentMethod: string;
  txnId: string;
  items: CartItem[];
}) {
  if (data.items.length === 0) throw new Error("Cart is empty");

  // Gross = pre-discount. One-time top-ups have no term, so their unitPrice IS the gross.
  const grossSubtotal = data.items.reduce(
    (s, i) => s + (i.isOneTime ? i.unitPrice : i.baseMonthly * i.termMonths) * i.qty,
    0
  );
  const total = data.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const discount = grossSubtotal - total;

  const itemsData = data.items.map((i) => ({
    productId: i.productId,
    termMonths: i.termMonths,
    qty: i.qty,
    unitPrice: i.unitPrice,
  }));

  // orderId is a short human-readable code (PH-XXXX) and @unique — retry on the rare collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderId = "PH-" + Math.floor(1000 + Math.random() * 9000);
    try {
      const order = await prisma.order.create({
        data: {
          orderId,
          customerName: data.customerName,
          phone: data.phone,
          email: data.email,
          paymentMethod: data.paymentMethod,
          txnId: data.txnId,
          subtotal: grossSubtotal,
          discount,
          total,
          items: { create: itemsData },
        },
      });
      return order.orderId;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002" &&
        attempt < 4
      ) {
        continue;
      }
      throw e;
    }
  }
  throw new Error("Could not generate a unique order id");
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await prisma.order.update({
    where: { id },
    data: { status }
  })
}

export async function getOrderStatus(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { orderId }
  })
  return order ? order.status : null
}

/** Customer chat/support message — lands in /admin/messages. */
export async function sendChatMessage(data: {
  name?: string;
  phone?: string;
  body: string;
}): Promise<{ ok: boolean }> {
  const body = data.body.trim();
  if (!body) return { ok: false };
  await prisma.message.create({
    data: {
      name: data.name?.trim() || null,
      phone: data.phone?.trim() || null,
      body: body.slice(0, 2000),
    },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}


