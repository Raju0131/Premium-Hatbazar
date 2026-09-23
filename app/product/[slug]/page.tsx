import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { getProduct } from "@/lib/queries";
import { SaleStrip } from "@/components/layout/SaleStrip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartPanel } from "@/components/layout/CartPanel";
import { Toast } from "@/components/shared/Toast";
import { BuyBox } from "@/components/product/BuyBox";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

// Product content comes from the DB per request (admin edits reflect immediately).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not Found" };
  return {
    title: product.nameBn,
    description: product.aboutBn,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
      <SaleStrip />
      <Header />

      <main className="animate-ph-in" style={{ width: "min(1240px, calc(100% - 32px))", margin: "0 auto", padding: "26px 0 72px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
          <Link href="/#catalogue" style={{ color: "var(--color-neutral-500)" }}>প্রোডাক্ট</Link>
          <span>/</span>
          <span style={{ color: "var(--color-accent-400)" }}>{product.category}</span>
          <span>/</span>
          <span style={{ color: "var(--color-neutral-300)" }}>{product.nameBn}</span>
        </div>

        <div className="resp-col2" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.04fr) minmax(0,.96fr)", gap: 40, marginTop: 20, alignItems: "start" }}>
          {/* Left — Product info */}
          <div>
            {/* Header card */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 26, borderRadius: "var(--radius-lg)", background: "linear-gradient(122deg, var(--color-section), var(--color-section-glow))", boxShadow: "var(--shadow-md)" }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, flexShrink: 0, borderRadius: 14, overflow: "hidden", background: "var(--color-bg)", fontSize: "18px", fontWeight: 600, color: "var(--color-accent-400)" }}>
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt={product.nameBn} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  product.mark
                )}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "11.5px", fontWeight: 600, letterSpacing: ".05em", color: "var(--color-accent-300)" }}>
                  {product.category}
                </div>
                <h1 style={{ margin: "6px 0 0", fontFamily: "inherit", fontSize: 31, letterSpacing: "-0.035em", color: "var(--color-neutral-100)" }}>
                  {product.nameBn}
                </h1>
              </div>
            </div>

            {/* About */}
            <p style={{ marginTop: 22, maxWidth: "62ch", fontFamily: "var(--font-body)", fontSize: "15.5px", lineHeight: 1.75, color: "var(--color-neutral-300)" }}>
              {product.aboutBn}
            </p>

            {/* Specs grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: 12, marginTop: 22 }}>
              {product.specs.map((s) => (
                <div key={s.k} style={{ padding: 15, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-md)", background: "var(--color-surface)" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: ".05em", color: "var(--color-neutral-600)" }}>{s.k}</div>
                  <div style={{ marginTop: 6, fontSize: "14px", fontWeight: 600, color: "var(--color-neutral-100)" }}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* Includes */}
            <h3 style={{ marginTop: 30, fontFamily: "inherit", fontSize: 19, letterSpacing: "-0.025em", color: "var(--color-neutral-100)" }}>
              কী কী থাকবে
            </h3>
            <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
              {product.includes.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <CheckCircle weight="bold" size={17} color="var(--color-accent-400)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: "14.5px", fontWeight: 500, color: "var(--color-neutral-300)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Buy box */}
          <BuyBox product={product} />
        </div>
      </main>

      <Footer />
      <CartPanel />
      <Toast />
    </div>
  );
}
