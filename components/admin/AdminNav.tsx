"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquaresFour, Receipt, Package, ChatCircleDots } from "@phosphor-icons/react/dist/ssr";

const items = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: SquaresFour, exact: true },
  { href: "/admin/orders", label: "অর্ডার ম্যানেজমেন্ট", icon: Receipt, exact: false },
  { href: "/admin/products", label: "প্রোডাক্ট ক্যাটালগ", icon: Package, exact: false },
  { href: "/admin/messages", label: "মেসেজ", icon: ChatCircleDots, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: "grid", gap: 4, marginTop: 12, padding: "0 12px" }}>
      {items.map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              background: active ? "var(--color-accent-900)" : "transparent",
              fontSize: "14px",
              fontWeight: 600,
              color: active ? "var(--color-accent-300)" : "var(--color-neutral-300)",
              textDecoration: "none",
            }}
          >
            <Icon weight="bold" /> {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
