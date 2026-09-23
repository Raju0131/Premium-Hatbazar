"use client";

import { useState } from "react";
import { FAQ_DATA } from "@/lib/types";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="faq"
      className="resp-col2 resp-sec"
      style={{
        width: "min(1240px, calc(100% - 32px))",
        margin: "0 auto",
        padding: "64px 0 0",
        display: "grid",
        gridTemplateColumns: "minmax(0,.78fr) minmax(0,1.22fr)",
        gap: 36,
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
          সাধারণ প্রশ্ন
        </h2>
        <p style={{ marginTop: 9, fontSize: "14px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
          এখানে উত্তর না পেলে হোয়াটসঅ্যাপ করুন — ৪ মিনিটে রিপ্লাই।
        </p>
        <a
          href="#order"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            height: 42,
            padding: "0 18px",
            marginTop: 16,
            whiteSpace: "nowrap",
            borderRadius: 9,
            border: "1.5px solid var(--color-accent-800)",
            fontSize: "13.5px",
            fontWeight: 700,
            color: "var(--color-accent-300)",
          }}
        >
          +৮৮০ ১৩১৫ ১৫২০০৫
        </a>
      </div>

      <ScrollReveal style={{ borderTop: "1px solid var(--color-divider)" }}>
        {FAQ_DATA.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--color-divider)" }}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                width: "100%",
                padding: "17px 2px",
                border: 0,
                background: "transparent",
                textAlign: "left",
                fontFamily: "inherit",
                fontSize: "15.5px",
                fontWeight: 600,
                color: "var(--color-neutral-100)",
                cursor: "pointer",
              }}
            >
              {f.q}
              <span
                style={{
                  flexShrink: 0,
                  fontSize: "19px",
                  fontWeight: 600,
                  color: "var(--color-accent-400)",
                }}
              >
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && (
              <p
                id={`faq-panel-${i}`}
                style={{
                  margin: 0,
                  padding: "0 40px 18px 2px",
                  fontFamily: "var(--font-body)",
                  fontSize: "14.5px",
                  lineHeight: 1.7,
                  color: "var(--color-neutral-400)",
                }}
              >
                {f.a}
              </p>
            )}
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
