import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByIdDb } from "@/lib/queries";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdDb(id);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-500)" }}>
        ← প্রোডাক্ট ক্যাটালগ
      </Link>
      <h1 style={{ margin: "12px 0 22px", fontFamily: "inherit", fontSize: 28, letterSpacing: "-0.03em", color: "var(--color-neutral-100)" }}>
        প্রোডাক্ট এডিট — <span style={{ color: "var(--color-accent-400)" }}>{product.nameBn}</span>
      </h1>
      <ProductForm product={product} />
    </div>
  );
}
