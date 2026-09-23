"use client";

import { useCart } from "@/components/providers/CartProvider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function CTABand() {
  const { openCart } = useCart();

  return (
    <section
      id="order"
      className="resp-sec"
      style={{
        width: "min(1240px, calc(100% - 32px))",
        margin: "0 auto",
        padding: "64px 0 72px",
      }}
    >
      <ScrollReveal>
        <div
          className="resp-col2 resp-pad"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) auto",
            gap: 32,
            alignItems: "center",
            padding: "38px 34px",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(122deg, var(--color-section), var(--color-section-glow))",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "inherit",
                fontSize: 32,
                letterSpacing: "-0.04em",
                color: "var(--color-neutral-100)",
                textWrap: "balance",
              }}
            >
              আজই অর্ডার করুন — ১০ মিনিটে অ্যাকাউন্ট।
            </h2>
            <p
              style={{
                marginTop: 10,
                maxWidth: "52ch",
                fontSize: "14.5px",
                fontWeight: 500,
                color: "var(--color-accent-200)",
              }}
            >
              কার্টে যোগ করে চেকআউট করুন, বা হোয়াটসঅ্যাপে সরাসরি বলুন কী লাগবে।
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button
              onClick={openCart}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                height: 46,
                padding: "0 22px",
                whiteSpace: "nowrap",
                border: 0,
                borderRadius: 10,
                background: "var(--color-accent-300)",
                fontFamily: "inherit",
                fontSize: "14.5px",
                fontWeight: 600,
                color: "var(--color-section)",
                cursor: "pointer",
              }}
            >
              চেকআউট করুন
            </button>
            <a
              href="#top"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                height: 46,
                padding: "0 20px",
                whiteSpace: "nowrap",
                borderRadius: 10,
                border: "1.5px solid color-mix(in srgb, var(--color-accent-100) 40%, transparent)",
                fontSize: "14.5px",
                fontWeight: 700,
                color: "var(--color-accent-100)",
              }}
            >
              হোয়াটসঅ্যাপ
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
