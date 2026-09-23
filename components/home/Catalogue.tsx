"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CATEGORIES, type Product } from "@/lib/types";
import { TERMS, calcPrice } from "@/lib/price";
import { bnNum } from "@/lib/bn";
import { useCart } from "@/components/providers/CartProvider";
import { useSearch } from "@/components/providers/SearchProvider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function Catalogue({ products }: { products: Product[] }) {
  const { addToCart } = useCart();
  const { query: search } = useSearch();
  const [cat, setCat] = useState("All");
  const [termMonths, setTermMonths] = useState(1);

  const term = TERMS.find((t) => t.months === termMonths) ?? TERMS[0];

  const filtered = useMemo(() => {
    let list = products;
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.mark.toLowerCase().includes(q)
      );
    }
    return list;
  }, [cat, search, products]);

  const resultLine = `${filtered.length}টি প্রোডাক্ট${cat !== "All" ? ` — ${cat}` : ""}`;

  return (
    <section
      id="catalogue"
      className="resp-sec"
      style={{
        width: "min(1240px, calc(100% - 32px))",
        margin: "0 auto",
        padding: "56px 0 0",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: "inherit",
              fontSize: 30,
              letterSpacing: "-0.035em",
              color: "var(--color-neutral-100)",
            }}
          >
            সব প্রোডাক্ট
          </h2>
          <p style={{ marginTop: 7, fontSize: "14px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
            {resultLine}
          </p>
        </div>
        {/* Term selector */}
        <div className="seg" style={{ flexShrink: 0 }}>
          {TERMS.map((t) => (
            <button
              key={t.months}
              className="seg-opt"
              onClick={() => setTermMonths(t.months)}
              aria-pressed={t.months === termMonths ? "true" : "false"}
              style={{
                fontFamily: "inherit",
                fontWeight: 600,
                background: t.months === termMonths ? "var(--color-accent-900)" : "transparent",
                color: t.months === termMonths ? "var(--color-accent-300)" : "var(--color-neutral-400)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div
        className="no-scrollbar"
        style={{
          display: "flex",
          gap: 8,
          marginTop: 20,
          overflowX: "auto",
          paddingBottom: 2,
        }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className="resp-touch"
            onClick={() => setCat(c)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: 38,
              padding: "0 15px",
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: 19,
              border: `1px solid ${c === cat ? "var(--color-accent-700)" : "var(--color-neutral-800)"}`,
              background: c === cat ? "var(--color-accent-900)" : "transparent",
              fontFamily: "inherit",
              fontSize: "13px",
              fontWeight: 600,
              color: c === cat ? "var(--color-accent-300)" : "var(--color-neutral-400)",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <ScrollReveal
        stagger={0.06}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 228px), 1fr))",
          gap: 12,
          marginTop: 20,
        }}
      >
        {filtered.map((p) => {
          const price = calcPrice(p.monthlyPrice, term.months, term.discountPercent, p.isOneTime);
          const gross = p.isOneTime ? price : p.monthlyPrice * term.months;
          const hasDiscount = !p.isOneTime && term.discountPercent > 0;
          const unit = p.isOneTime ? p.unitLabel : term.months === 1 ? "/ মাস" : `/ ${term.label}`;
          const img = p.imageUrl;

          return (
            <div
              key={p.id}
              className="card card-int"
              style={{
                gap: 0,
                padding: 0,
                overflow: "hidden",
                border: "1px solid var(--color-neutral-800)",
              }}
            >
              {/* Product image (falls back to gradient + mark until an imageUrl is set) */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 3",
                  background: "linear-gradient(135deg, var(--color-section), var(--color-section-glow))",
                  overflow: "hidden",
                }}
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={p.nameBn}
                    loading="lazy"
                    decoding="async"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-accent-200)", opacity: 0.92 }}>
                      {p.mark}
                    </span>
                  </div>
                )}
                <span
                  className="tag tag-accent"
                  style={{ position: "absolute", top: 10, left: 10, fontSize: "10px", fontWeight: 600, letterSpacing: ".04em" }}
                >
                  {p.badge}
                </span>
              </div>

              {/* Body */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, padding: 14 }}>
                <Link
                  href={`/product/${p.slug}`}
                  style={{
                    fontFamily: "inherit",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--color-neutral-100)",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  {p.nameBn}
                </Link>
                <div style={{ marginTop: 3, fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
                  {p.metaBn}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 7, marginTop: "auto", paddingTop: 12 }}>
                  <span style={{ fontSize: "20px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
                    ৳{bnNum(price)}
                  </span>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-500)" }}>
                    {unit}
                  </span>
                  {hasDiscount && (
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-neutral-600)", textDecoration: "line-through" }}>
                      ৳{bnNum(gross)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <div style={{ marginTop: 5, fontSize: "11.5px", fontWeight: 700, color: "var(--color-accent-400)" }}>
                    সেভ {bnNum(term.discountPercent)}%
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
                  <button
                    className="resp-touch"
                    onClick={() => addToCart(p, termMonths)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      height: 38,
                      border: "1px solid var(--color-accent-800)",
                      borderRadius: 9,
                      background: "transparent",
                      fontFamily: "inherit",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--color-accent-300)",
                      cursor: "pointer",
                    }}
                  >
                    কার্টে যোগ
                  </button>
                  <Link
                    href={`/product/${p.slug}`}
                    className="resp-touch"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 38,
                      padding: "0 15px",
                      border: "1px solid var(--color-neutral-800)",
                      borderRadius: 9,
                      fontFamily: "inherit",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--color-neutral-300)",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    দেখুন
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollReveal>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div
          style={{
            padding: "44px 20px",
            marginTop: 12,
            textAlign: "center",
            border: "1px dashed var(--color-neutral-800)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-neutral-200)" }}>
            কিছু পাওয়া যায়নি
          </div>
          <p style={{ marginTop: 6, fontSize: "13.5px", color: "var(--color-neutral-500)" }}>
            হোয়াটসঅ্যাপ করুন — যা লাগবে এনে দিব।
          </p>
        </div>
      )}
    </section>
  );
}
