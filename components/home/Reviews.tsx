import { REVIEWS_DATA } from "@/lib/types";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function Reviews() {
  return (
    <section
      id="reviews"
      className="resp-sec"
      style={{
        width: "min(1240px, calc(100% - 32px))",
        margin: "0 auto",
        padding: "64px 0 0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: "inherit",
            fontSize: 30,
            letterSpacing: "-0.035em",
            color: "var(--color-neutral-100)",
          }}
        >
          ১,৯০০ রিভিউ, ৪.৯ রেটিং
        </h2>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-neutral-500)" }}>
          ফেসবুক গ্রুপ ও হোয়াটসঅ্যাপ থেকে
        </span>
      </div>

      <ScrollReveal
        className="resp-col3"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 12,
          marginTop: 22,
        }}
      >
        {REVIEWS_DATA.map((r) => (
          <div
            key={r.name}
            className="card"
            style={{ padding: 20, border: "1px solid var(--color-neutral-800)" }}
          >
            <div style={{ fontSize: "13px", letterSpacing: ".14em", color: "var(--color-accent-400)" }}>
              ★★★★★
            </div>
            <p
              style={{
                marginTop: 12,
                fontFamily: "var(--font-body)",
                fontSize: "14.5px",
                fontWeight: 400,
                lineHeight: 1.65,
                color: "var(--color-neutral-300)",
              }}
            >
              {r.body}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginTop: "auto",
                paddingTop: 16,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--color-accent-900)",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "var(--color-accent-300)",
                }}
              >
                {r.initials}
              </span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-neutral-200)" }}>
                  {r.name}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
                  {r.meta}
                </div>
              </div>
            </div>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
