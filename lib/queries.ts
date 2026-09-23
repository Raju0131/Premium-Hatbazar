import "server-only";
import { prisma } from "./prisma";
import { PRODUCTS, getProductBySlug } from "./products";
import type { Product, ProductSpec } from "./types";
import type { Product as PrismaProduct } from "@prisma/client";

/** Canonical display order (from the mockup) keyed by slug. */
const CANONICAL_ORDER = new Map(PRODUCTS.map((p, i) => [p.slug, i]));

function dbToProduct(r: PrismaProduct): Product {
  return {
    id: r.id,
    slug: r.slug,
    nameBn: r.nameBn,
    category: r.category,
    mark: r.mark,
    monthlyPrice: r.monthlyPrice,
    isOneTime: r.isOneTime,
    unitLabel: r.unitLabel,
    badge: r.badge,
    deliveryEta: r.deliveryEta,
    stock: r.stock,
    aboutBn: r.aboutBn,
    metaBn: r.metaBn,
    specs: Array.isArray(r.specs) ? (r.specs as unknown as ProductSpec[]) : [],
    includes: Array.isArray(r.includes) ? (r.includes as unknown as string[]) : [],
    wasPrice: r.wasPrice ?? undefined,
    imageUrl: r.imageUrl ?? null,
  };
}

/**
 * All products for the storefront, read from the DB (so admin edits + image
 * URLs show up). Ordered to match the mockup; admin-created products go last.
 * Fails soft to the static list if the DB is unreachable.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany();
    if (rows.length === 0) return PRODUCTS;
    rows.sort((a, b) => {
      const oa = CANONICAL_ORDER.get(a.slug) ?? 999;
      const ob = CANONICAL_ORDER.get(b.slug) ?? 999;
      if (oa !== ob) return oa - ob;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    return rows.map(dbToProduct);
  } catch {
    return PRODUCTS;
  }
}

/** One product by slug (falls back to the static list if the DB is unreachable). */
export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({ where: { slug } });
    if (row) return dbToProduct(row);
  } catch {
    /* fall through to static */
  }
  return getProductBySlug(slug) ?? null;
}

/** One product by DB id (admin edit screens). */
export async function getProductByIdDb(id: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({ where: { id } });
    return row ? dbToProduct(row) : null;
  } catch {
    return null;
  }
}

// ── Admin: orders ──

export async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}

export async function getOrder(idOrOrderId: string) {
  return prisma.order.findFirst({
    where: { OR: [{ id: idOrOrderId }, { orderId: idOrOrderId }] },
    include: { items: { include: { product: true } } },
  });
}

// ── Admin: messages ──

export async function getMessages() {
  return prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
}

export async function getUnreadMessageCount() {
  try {
    return await prisma.message.count({ where: { read: false } });
  } catch {
    return 0;
  }
}
