"use server"

import { randomInt } from "node:crypto"
import { revalidatePath } from "next/cache"
import { CartItem, PAYMENT_METHODS } from "@/lib/types"
import { isValidEmail } from "@/lib/validate"
import { TERMS, calcPrice, getTerm } from "@/lib/price"
import { Prisma } from "@prisma/client"
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
  if (!PAYMENT_METHODS.some((m) => m.key === data.paymentMethod)) {
    throw new Error("Unknown payment method");
  }
  if (!data.customerName.trim() || !data.phone.trim() || !data.txnId.trim() || !isValidEmail(data.email)) {
    throw new Error("Missing or invalid customer details");
  }

  if (data.items.length > 50) throw new Error("Too many cart lines");

  // Re-price every line from the database; prices, terms and quantities sent by the
  // browser are never trusted.
  const products = await prisma.product.findMany({
    where: { id: { in: [...new Set(data.items.map((i) => i.productId))] } },
    select: { id: true, monthlyPrice: true, isOneTime: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  let grossSubtotal = 0;
  let total = 0;
  const itemsData = data.items.map((i) => {
    const product = byId.get(i.productId);
    if (!product) throw new Error("Unknown product");
    if (!Number.isInteger(i.qty) || i.qty < 1 || i.qty > 20) throw new Error("Invalid quantity");
    // One-time top-ups are stored with termMonths 0; subscriptions must use one of TERMS.
    const validTerm = product.isOneTime
      ? i.termMonths === 0
      : TERMS.some((t) => t.months === i.termMonths);
    if (!validTerm) throw new Error("Invalid term");

    const unitPrice = calcPrice(
      product.monthlyPrice,
      i.termMonths,
      getTerm(i.termMonths).discountPercent,
      product.isOneTime
    );
    // Gross = pre-discount. One-time top-ups have no term, so their price IS the gross.
    const gross = product.isOneTime ? product.monthlyPrice : product.monthlyPrice * i.termMonths;
    grossSubtotal += gross * i.qty;
    total += unitPrice * i.qty;
    return { productId: product.id, termMonths: i.termMonths, qty: i.qty, unitPrice };
  });
  const discount = grossSubtotal - total;

  // orderId is a short human-readable code (PH-XXXXXX) and @unique — retry on the rare collision.
  // Six random digits leave a million codes, so they stay hard to guess or run out of.
  for (let attempt = 0; attempt < 5; attempt++) {
    const orderId = "PH-" + randomInt(100000, 1000000);
    try {
      const order = await prisma.order.create({
        data: {
          orderId,
          customerName: data.customerName,
          phone: data.phone,
          email: data.email.trim(),
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


