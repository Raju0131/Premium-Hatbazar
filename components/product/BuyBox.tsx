"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { TERMS, calcPrice } from "@/lib/price";
import { bnNum } from "@/lib/bn";
import gsap from "gsap";
import type { Product } from "@/lib/types";

export function BuyBox({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [termMonths, setTermMonths] = useState(1);
  const term = TERMS.find((t) => t.months === termMonths) ?? TERMS[0];
  const price = calcPrice(product.monthlyPrice, term.months, term.discountPercent, product.isOneTime);
  const hasDiscount = !product.isOneTime && term.discountPercent > 0;
  const basePrice = product.monthlyPrice * term.months;
  const savings = basePrice - price;
  
  const priceRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (priceRef.current) {
      const currentVal = parseFloat(priceRef.current.dataset.val || price.toString());
      const obj = { val: currentVal };
      gsap.to(obj, {
        val: price,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          if (priceRef.current) {
            priceRef.current.textContent = `৳${bnNum(Math.round(obj.val))}`;
            priceRef.current.dataset.val = obj.val.toString();
          }
        }
      });
    }
  }, [price]);

  const perMonth = product.isOneTime
    ? "এক বারের টপ-আপ"
    : term.months === 1
    ? "/ মাস"
    : `≈ ৳${bnNum(Math.round(price / term.months))} / মাস`;

  const handleBuyNow = () => {
    addToCart(product, termMonths);
    window.location.href = "/checkout";
  };

  return (
    <div
      className="resp-unstick resp-buybox"
      style={{
        position: "sticky",
        top: 78,
        padding: 22,
        border: "1px solid var(--color-neutral-800)",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ fontSize: "11.5px", fontWeight: 600, letterSpacing: ".05em", color: "var(--color-neutral-600)" }}>
        টার্ম বেছে নিন
      </div>
      <div className="seg" style={{ width: "100%", marginTop: 10 }}>
        {TERMS.map((t) => (
          <button
            key={t.months}
            className="seg-opt"
            onClick={() => setTermMonths(t.months)}
            aria-pressed={t.months === termMonths ? "true" : "false"}
            style={{
              flex: 1,
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

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginTop: 20 }}>
        <div>
          <div ref={priceRef} data-val={price} style={{ fontSize: 38, fontWeight: 600, letterSpacing: "-0.04em", color: "var(--color-neutral-100)" }}>
            ৳{bnNum(price)}
          </div>
          <div style={{ marginTop: 6, fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-500)" }}>
            {perMonth}
          </div>
        </div>
        {hasDiscount && (
          <div style={{ padding: "5px 9px", borderRadius: 6, background: "var(--color-accent-800)", fontSize: "12px", fontWeight: 600, color: "var(--color-accent-200)" }}>
            ৳{bnNum(savings)} সেভ
          </div>
        )}
      </div>

      <button
        onClick={() => addToCart(product, termMonths)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: "100%",
          height: 46,
          marginTop: 18,
          border: "1px solid var(--color-accent-800)",
          borderRadius: 10,
          background: "transparent",
          fontFamily: "inherit",
          fontSize: "14.5px",
          fontWeight: 600,
          color: "var(--color-accent-300)",
          cursor: "pointer",
        }}
      >
        কার্টে যোগ করুন — ৳{bnNum(price)}
      </button>
      <button
        onClick={handleBuyNow}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          width: "100%",
          height: 44,
          marginTop: 9,
          border: "1.5px solid var(--color-accent-800)",
          borderRadius: 10,
          background: "transparent",
          fontFamily: "inherit",
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--color-accent-300)",
          cursor: "pointer",
        }}
      >
        এখনই কিনুন — সরাসরি চেকআউট
      </button>

      <div style={{ display: "grid", gap: 8, marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--color-divider)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
          <span style={{ color: "var(--color-neutral-500)" }}>ডেলিভারি</span>
          <span style={{ color: "var(--color-neutral-200)" }}>{product.deliveryEta}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
          <span style={{ color: "var(--color-neutral-500)" }}>ওয়ারেন্টি</span>
          <span style={{ color: "var(--color-neutral-200)" }}>পুরো টার্ম</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
          <span style={{ color: "var(--color-neutral-500)" }}>স্টক</span>
          <span style={{ color: "var(--color-accent-400)" }}>{product.stock} টি আছে</span>
        </div>
      </div>
    </div>
  );
}
