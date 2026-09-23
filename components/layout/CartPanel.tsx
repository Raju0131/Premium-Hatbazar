"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { bnNum } from "@/lib/bn";
import { displayTermLabel } from "@/lib/price";
import { X } from "@phosphor-icons/react/dist/ssr";

export function CartPanel() {
  const { items, isOpen, closeCart, cartCount, total, setQty, removeItem } = useCart();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
        return;
      }
      if (e.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Focus first element on open
    setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      first?.focus();
    }, 100);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          background: "rgba(0,0,0,.6)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        className="resp-cartpanel animate-pv-in"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 95,
          display: "flex",
          flexDirection: "column",
          width: 388,
          maxWidth: "100%",
          background: "var(--color-bg)",
          borderLeft: "1px solid var(--color-neutral-800)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "18px 20px",
            borderBottom: "1px solid var(--color-divider)",
          }}
        >
          <div
            style={{
              fontSize: "17px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--color-neutral-100)",
            }}
          >
            কার্ট{" "}
            <span style={{ color: "var(--color-neutral-600)" }}>({cartCount})</span>
          </div>
          <button
            onClick={closeCart}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              border: "1px solid var(--color-neutral-800)",
              borderRadius: 8,
              background: "transparent",
              color: "var(--color-neutral-300)",
              cursor: "pointer",
            }}
          >
            <X weight="bold" size={15} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
          {items.length === 0 && (
            <div style={{ padding: "40px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "15.5px", fontWeight: 700, color: "var(--color-neutral-300)" }}>
                কার্ট খালি
              </div>
              <p style={{ marginTop: 6, fontSize: "13px", color: "var(--color-neutral-600)" }}>
                প্রোডাক্ট যোগ করুন, এখানে দেখা যাবে।
              </p>
            </div>
          )}
          <div style={{ display: "grid", gap: 14 }}>
            {items.map((c) => {
              return (
                <div
                  key={c.key}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 11,
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--color-divider)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 38,
                      height: 38,
                      flexShrink: 0,
                      borderRadius: 9,
                      background: "var(--color-neutral-900)",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      color: "var(--color-neutral-300)",
                    }}
                  >
                    {c.mark}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
                      {c.nameBn}
                    </div>
                    <div style={{ marginTop: 2, fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
                      {displayTermLabel(c)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 8 }}>
                      <button
                        onClick={() => setQty(c.key, c.qty - 1)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 25,
                          height: 25,
                          border: "1px solid var(--color-neutral-800)",
                          borderRadius: 6,
                          background: "transparent",
                          fontFamily: "inherit",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--color-neutral-300)",
                          cursor: "pointer",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          minWidth: 14,
                          textAlign: "center",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--color-neutral-200)",
                        }}
                      >
                        {c.qty}
                      </span>
                      <button
                        onClick={() => setQty(c.key, c.qty + 1)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 25,
                          height: 25,
                          border: "1px solid var(--color-neutral-800)",
                          borderRadius: 6,
                          background: "transparent",
                          fontFamily: "inherit",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--color-neutral-300)",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(c.key)}
                        style={{
                          marginLeft: 4,
                          padding: "4px 6px",
                          border: 0,
                          background: "transparent",
                          fontFamily: "inherit",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          color: "var(--color-neutral-600)",
                          cursor: "pointer",
                        }}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: "14.5px", fontWeight: 600, color: "var(--color-neutral-100)" }}>
                    ৳{bnNum(c.unitPrice * c.qty)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "18px 20px",
            borderTop: "1px solid var(--color-divider)",
            background: "var(--color-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-neutral-400)" }}>
              মোট
            </span>
            <span
              style={{
                fontSize: "25px",
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: "var(--color-neutral-100)",
              }}
            >
              ৳{bnNum(total)}
            </span>
          </div>
          <a
            href="/checkout"
            onClick={closeCart}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              width: "100%",
              height: 46,
              marginTop: 13,
              border: "1px solid var(--color-accent-800)",
              borderRadius: 10,
              background: "transparent",
              fontFamily: "inherit",
              fontSize: "14.5px",
              fontWeight: 600,
              color: "var(--color-accent-300)",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            চেকআউট →
          </a>
        </div>
      </aside>
    </>
  );
}
