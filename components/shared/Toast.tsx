"use client";

import { useCart } from "@/components/providers/CartProvider";
import { Check } from "@phosphor-icons/react/dist/ssr";

export function Toast() {
  const { toast, openCart } = useCart();
  if (!toast) return null;

  return (
    <div
      className="animate-ph-toast"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "13px 16px",
        borderRadius: "var(--radius-md)",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
          flexShrink: 0,
          borderRadius: "50%",
          background: "var(--color-accent-500)",
        }}
      >
        <Check weight="bold" size={14} color="var(--color-bg)" />
      </span>
      <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
        {toast}
      </span>
      <button
        onClick={openCart}
        style={{
          marginLeft: 6,
          padding: 0,
          border: 0,
          background: "transparent",
          fontFamily: "inherit",
          fontSize: "12.5px",
          fontWeight: 700,
          color: "var(--color-accent-400)",
          cursor: "pointer",
        }}
      >
        কার্ট দেখুন
      </button>
    </div>
  );
}
