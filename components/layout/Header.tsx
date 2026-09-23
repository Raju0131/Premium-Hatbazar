"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { useSearch } from "@/components/providers/SearchProvider";
import { MagnifyingGlass, ShoppingBag, List } from "@phosphor-icons/react/dist/ssr";

export function Header() {
  const { cartCount, openCart } = useCart();
  const { query, setQuery } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap + Escape for the mobile drawer (a11y, matches the cart panel behaviour).
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button, input, [tabindex]:not([tabindex="-1"])'
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
    };
    document.addEventListener("keydown", handleKeyDown);
    const t = setTimeout(() => {
      drawerRef.current?.querySelector<HTMLElement>("input")?.focus();
    }, 60);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(t);
    };
  }, [menuOpen]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "color-mix(in srgb, var(--color-bg) 88%, transparent)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--color-divider)",
      }}
    >
      <div
        style={{
          width: "min(1240px, calc(100% - 32px))",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "13px 0",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginRight: "auto",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              flexShrink: 0,
              borderRadius: 9,
              background: "var(--color-accent-500)",
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--color-bg)",
            }}
          >
            P
          </span>
          <span
            style={{
              fontSize: "18.5px",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "var(--color-neutral-100)",
              whiteSpace: "nowrap",
            }}
          >
            Premium{" "}
            <span style={{ color: "var(--color-accent-400)" }}>Hatbazar</span>
          </span>
        </Link>

        {/* Search (desktop) */}
        <div
          className="resp-hide-desktop"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 9,
            width: 290,
          }}
        >
          <MagnifyingGlass
            weight="bold"
            size={15}
            color="var(--color-neutral-600)"
            style={{ position: "absolute", left: 11, flexShrink: 0, pointerEvents: "none" }}
          />
          <input
            className="input"
            placeholder="নেটফ্লিক্স, চ্যাটজিপিটি, ক্যানভা…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="প্রোডাক্ট সার্চ"
            style={{ flex: 1, minWidth: 0, height: 38, paddingLeft: 32, fontSize: "13px" }}
          />
        </div>

        {/* Nav links (desktop) */}
        <nav
          className="resp-hide-desktop"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: "13.5px",
            fontWeight: 600,
          }}
        >
          <Link href="/#catalogue" style={{ color: "var(--color-neutral-300)" }}>
            প্রোডাক্ট
          </Link>
          <Link href="/#how" style={{ color: "var(--color-neutral-300)" }}>
            কিভাবে কাজ করে
          </Link>
          <Link href="/track/search" style={{ color: "var(--color-neutral-300)" }}>
            অর্ডার ট্র্যাক
          </Link>
        </nav>

        {/* Cart button */}
        <button
          onClick={openCart}
          aria-label="কার্ট দেখুন"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: 38,
            padding: "0 14px",
            flexShrink: 0,
            border: "1px solid var(--color-accent-800)",
            borderRadius: 9,
            background: "transparent",
            fontFamily: "inherit",
            fontSize: "13.5px",
            fontWeight: 600,
            color: "var(--color-accent-300)",
            cursor: "pointer",
          }}
        >
          <ShoppingBag weight="bold" size={15} />
          <span className="resp-saletext">কার্ট</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 19,
              height: 19,
              padding: "0 5px",
              borderRadius: 5,
              background: "var(--color-accent-800)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-accent-100)",
            }}
          >
            {cartCount}
          </span>
        </button>

        {/* Mobile menu button */}
        <button
          className="resp-show-mobile resp-touch"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={menuOpen}
          aria-controls="pv-mobile-drawer"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            flexShrink: 0,
            border: "1px solid var(--color-neutral-800)",
            borderRadius: 9,
            background: "var(--color-surface)",
            color: "var(--color-neutral-200)",
            cursor: "pointer",
          }}
        >
          <List weight="bold" size={17} />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="pv-mobile-drawer"
          ref={drawerRef}
          className="animate-pv-in"
          style={{
            padding: "6px 16px 16px",
            borderTop: "1px solid var(--color-divider)",
          }}
        >
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <MagnifyingGlass
              weight="bold"
              size={15}
              color="var(--color-neutral-600)"
              style={{ position: "absolute", left: 11, flexShrink: 0, pointerEvents: "none" }}
            />
            <input
              className="input"
              placeholder="৪২০টি প্রোডাক্ট সার্চ করুন…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="প্রোডাক্ট সার্চ"
              style={{ flex: 1, minWidth: 0, height: 44, paddingLeft: 32, fontSize: "14px" }}
            />
          </div>
          <div style={{ display: "grid" }}>
            {[
              { href: "/#catalogue", label: "প্রোডাক্ট" },
              { href: "/#how", label: "কিভাবে কাজ করে" },
              { href: "/#reviews", label: "রিভিউ" },
              { href: "/#faq", label: "সাধারণ প্রশ্ন" },
              { href: "/track/search", label: "অর্ডার ট্র্যাক" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "13px 2px",
                  borderBottom: "1px solid var(--color-divider)",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--color-neutral-200)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
