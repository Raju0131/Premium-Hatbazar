import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/products" style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-500)" }}>
        ← প্রোডাক্ট ক্যাটালগ
      </Link>
      <h1 style={{ margin: "12px 0 22px", fontFamily: "inherit", fontSize: 28, letterSpacing: "-0.03em", color: "var(--color-neutral-100)" }}>
        নতুন প্রোডাক্ট
      </h1>
      <ProductForm />
    </div>
  );
}
