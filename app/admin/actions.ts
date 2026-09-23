"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

/* ── Orders ── */

export async function setOrderStatus(id: string, status: OrderStatus) {
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

/* ── Messages ── */

export async function markMessageRead(id: string, read: boolean) {
  await prisma.message.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

/* ── Products ── */

export interface ProductFormData {
  slug: string;
  nameBn: string;
  category: string;
  mark: string;
  monthlyPrice: number;
  isOneTime: boolean;
  unitLabel: string;
  badge: string;
  deliveryEta: string;
  stock: number;
  aboutBn: string;
  metaBn: string;
  wasPrice: number | null;
  imageUrl: string | null;
  specs: { k: string; v: string }[];
  includes: string[];
}

function toPrismaData(d: ProductFormData) {
  return {
    slug: d.slug,
    nameBn: d.nameBn,
    category: d.category,
    mark: d.mark,
    monthlyPrice: d.monthlyPrice,
    isOneTime: d.isOneTime,
    unitLabel: d.unitLabel,
    badge: d.badge,
    deliveryEta: d.deliveryEta,
    stock: d.stock,
    aboutBn: d.aboutBn,
    metaBn: d.metaBn,
    wasPrice: d.wasPrice,
    imageUrl: d.imageUrl,
    specs: d.specs as unknown as Prisma.InputJsonValue,
    includes: d.includes as unknown as Prisma.InputJsonValue,
  };
}

export async function createProduct(data: ProductFormData) {
  await prisma.product.create({ data: toPrismaData(data) });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateProduct(id: string, data: ProductFormData) {
  await prisma.product.update({ where: { id }, data: toPrismaData(data) });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/");
  revalidatePath(`/product/${data.slug}`);
}

export async function deleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return { ok: false, error: "এই প্রোডাক্টে অর্ডার আছে — আগে অর্ডার সরাতে হবে।" };
    }
    return { ok: false, error: "ডিলিট করা যায়নি।" };
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true };
}
