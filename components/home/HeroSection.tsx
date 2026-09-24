import Link from "next/link";
import { bnNum } from "@/lib/bn";
import { productIconUrl } from "@/lib/productImage";
import { PAYMENT_METHODS, type Product } from "@/lib/types";

export function HeroSection({ products }: { products: Product[] }) {
  const bySlug = (s: string) => products.find((p) => p.slug === s);
  const deal = bySlug("chatgpt-plus");
  const heroPicks = [bySlug("netflix-premium"), bySlug("canva-pro")].filter(
    (p): p is Product => Boolean(p)
  );

  return (
    <section
      className="resp-col2 resp-hero"
      style={{
        width: "min(1240px, calc(100% - 32px))",
        margin: "0 auto",
        padding: "44px 0 40px",
        display: "grid",
        gridTemplateColumns: "minmax(0,1.06fr) minmax(0,.94fr)",
        gap: 36,
        alignItems: "center",
      }}
    >
      {/* Left column */}
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 13px",
            borderRadius: 6,
            background: "var(--color-accent-900)",
            border: "1px solid var(--color-accent-800)",
            fontSize: "11.5px",
            fontWeight: 700,
            letterSpacing: ".04em",
            color: "var(--color-accent-300)",
          }}
        >
          বাংলাদেশের প্রিমিয়াম সাবস্ক্রিপশন স্টোর
        </div>
        <h1
          className="resp-h1"
          style={{
            marginTop: 16,
            fontFamily: "inherit",
            fontSize: 58,
            letterSpacing: "-0.045em",
            color: "var(--color-neutral-100)",
            textWrap: "balance",
          }}
        >
          প্রিমিয়াম অ্যাকাউন্ট,
          <br />
          এখনই। <span style={{ color: "var(--color-accent-400)" }}>সস্তায়।</span>
        </h1>
        <p
          style={{
            marginTop: 15,
            maxWidth: "46ch",
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            lineHeight: 1.65,
            color: "var(--color-neutral-400)",
          }}
        >
          ChatGPT, Netflix, Canva, Adobe — ১০০% আসল সাবস্ক্রিপশন। সাধারণত ১০–৩০ মিনিটে
          ডেলিভারি, পুরো টার্মে রিপ্লেসমেন্ট ওয়ারেন্টি।
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
          <Link
            href="#catalogue"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 46,
              padding: "0 22px",
              whiteSpace: "nowrap",
              borderRadius: 10,
              background: "transparent",
              border: "1px solid var(--color-accent-800)",
              fontSize: "14.5px",
              fontWeight: 600,
              color: "var(--color-accent-300)",
            }}
          >
            {bnNum(products.length)}টি প্রোডাক্ট দেখুন →
          </Link>
          <Link
            href="/track/search"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 46,
              padding: "0 20px",
              whiteSpace: "nowrap",
              borderRadius: 10,
              border: "1.5px solid var(--color-accent-800)",
              fontSize: "14.5px",
              fontWeight: 700,
              color: "var(--color-accent-300)",
            }}
          >
            আমার অর্ডার ট্র্যাক
          </Link>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 26, marginTop: 28 }}>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
              {bnNum(PAYMENT_METHODS.length)}টি
            </div>
            <div style={{ marginTop: 5, fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
              পেমেন্ট মাধ্যম
            </div>
          </div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
              ১০–৩০ মিনিট
            </div>
            <div style={{ marginTop: 5, fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
              সাধারণ ডেলিভারি সময়
            </div>
          </div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
              পুরো টার্ম
            </div>
            <div style={{ marginTop: 5, fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
              ওয়ারেন্টি
            </div>
          </div>
        </div>
      </div>

      {/* Right column — Hero art */}
      <div
        className="resp-heroart"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          alignContent: "start",
        }}
      >
        {/* Deal row */}
        <div
          className="resp-dealrow animate-ph-in"
          style={{
            gridColumn: "1 / -1",
            animationDelay: "0.02s",
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: 16,
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(122deg, var(--color-section), var(--color-section-glow))",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              flexShrink: 0,
              borderRadius: 11,
              overflow: "hidden",
              background: "var(--color-bg)",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-accent-400)",
            }}
          >
            {deal?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={productIconUrl(deal.imageUrl)} alt={deal.nameBn} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "GPT"
            )}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 8px",
                marginBottom: 6,
                borderRadius: 5,
                background: "color-mix(in srgb, var(--color-accent-100) 14%, transparent)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: ".05em",
                color: "var(--color-accent-200)",
              }}
            >
              আজকের ডিল
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
              ChatGPT Plus — ১ মাস
            </div>
            <div style={{ marginTop: 2, fontSize: "12px", fontWeight: 600, color: "var(--color-accent-300)" }}>
              প্রাইভেট মেইল · ১০–৩০ মিনিটে ডেলিভারি
            </div>
          </div>
          <div className="resp-dealprice" style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "23px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
              ৳১,১৫০
            </div>
            <div
              style={{
                marginTop: 3,
                fontSize: "11.5px",
                fontWeight: 600,
                color: "var(--color-accent-300)",
                textDecoration: "line-through",
              }}
            >
              ৳১,৪০০
            </div>
          </div>
        </div>

        {/* Hero pick cards */}
        {heroPicks.map((p, i) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="animate-ph-in"
            style={{
              display: "block",
              animationDelay: `${0.12 + i * 0.09}s`,
              width: "100%",
              textAlign: "left",
              padding: 14,
              border: "1px solid var(--color-neutral-800)",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-surface)",
              fontFamily: "inherit",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  overflow: "hidden",
                  background: "var(--color-neutral-900)",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--color-neutral-200)",
                }}
              >
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={productIconUrl(p.imageUrl)} alt={p.nameBn} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  p.mark
                )}
              </span>
              <span className="tag tag-accent" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: ".04em" }}>
                {p.badge}
              </span>
            </div>
            <div style={{ marginTop: 11, fontSize: "14.5px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
              {p.nameBn}
            </div>
            <div style={{ marginTop: 7, fontSize: "19px", fontWeight: 600, color: "var(--color-accent-400)" }}>
              ৳{bnNum(p.monthlyPrice)}
              <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
                {" "}
                {p.isOneTime ? p.unitLabel : "/ মাস"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
