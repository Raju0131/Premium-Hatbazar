"use client";

export function SaleStrip() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "9px 16px",
        background: "var(--color-section)",
        fontSize: "12.5px",
        fontWeight: 600,
        letterSpacing: ".01em",
        color: "var(--color-accent-100)",
      }}
    >
      <span
        className="animate-pv-pulse"
        style={{
          width: 6,
          height: 6,
          flexShrink: 0,
          borderRadius: "50%",
          background: "var(--color-accent-300)",
        }}
      />
      <span>ঈদ সেল — ৩ মাসের টার্মে ১২% ছাড়</span>
      <span className="resp-saletext" style={{ opacity: 0.55 }}>·</span>
      <span className="resp-saletext" style={{ opacity: 0.85, fontWeight: 600 }}>
        কোড PRIME12
      </span>
    </div>
  );
}
