import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-divider)",
        background: "var(--color-surface)",
      }}
    >
      <div
        className="resp-col4"
        style={{
          width: "min(1240px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "40px 0 22px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.5fr) repeat(3, minmax(0,1fr))",
          gap: 28,
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--color-accent-500)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--color-bg)",
              }}
            >
              P
            </span>
            <span
              style={{
                fontSize: "16.5px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--color-neutral-100)",
              }}
            >
              Premium{" "}
              <span style={{ color: "var(--color-accent-400)" }}>Hatbazar</span>
            </span>
          </div>
          <p
            style={{
              marginTop: 12,
              maxWidth: "36ch",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--color-neutral-500)",
            }}
          >
            বাংলাদেশের প্রিমিয়াম সাবস্ক্রিপশন স্টোর।
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 14 }}>
            {["বিকাশ", "নগদ", "রকেট"].map((m) => (
              <span
                key={m}
                style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  background: "var(--color-neutral-900)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "var(--color-neutral-300)",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <div
            style={{
              fontSize: "11.5px",
              fontWeight: 600,
              letterSpacing: ".05em",
              color: "var(--color-neutral-600)",
            }}
          >
            শপ
          </div>
          <div style={{ display: "grid", gap: 9, marginTop: 12, fontSize: "13px", fontWeight: 600 }}>
            <Link href="/#catalogue" style={{ color: "var(--color-neutral-400)" }}>সব প্রোডাক্ট</Link>
            <Link href="/#catalogue" style={{ color: "var(--color-neutral-400)" }}>এআই টুলস</Link>
            <Link href="/#catalogue" style={{ color: "var(--color-neutral-400)" }}>স্ট্রিমিং</Link>
            <Link href="/#catalogue" style={{ color: "var(--color-neutral-400)" }}>গিফট কার্ড</Link>
          </div>
        </div>

        {/* Support */}
        <div>
          <div
            style={{
              fontSize: "11.5px",
              fontWeight: 600,
              letterSpacing: ".05em",
              color: "var(--color-neutral-600)",
            }}
          >
            সহায়তা
          </div>
          <div style={{ display: "grid", gap: 9, marginTop: 12, fontSize: "13px", fontWeight: 600 }}>
            <Link href="/track/search" style={{ color: "var(--color-neutral-400)" }}>অর্ডার ট্র্যাক</Link>
            <Link href="/#faq" style={{ color: "var(--color-neutral-400)" }}>সাধারণ প্রশ্ন</Link>
            <Link href="/#how" style={{ color: "var(--color-neutral-400)" }}>কিভাবে কাজ করে</Link>
            <span style={{ color: "var(--color-neutral-400)" }}>ওয়ারেন্টি পলিসি</span>
          </div>
        </div>

        {/* Contact */}
        <div>
          <div
            style={{
              fontSize: "11.5px",
              fontWeight: 600,
              letterSpacing: ".05em",
              color: "var(--color-neutral-600)",
            }}
          >
            যোগাযোগ
          </div>
          <div style={{ display: "grid", gap: 9, marginTop: 12, fontSize: "13px", fontWeight: 600 }}>
            <span style={{ color: "var(--color-neutral-400)" }}>+৮৮০ ১৩১৫ ১৫২০০৫</span>
            <span style={{ color: "var(--color-neutral-400)" }}>hello@premiumhatbazar.bd</span>
            <span style={{ color: "var(--color-neutral-400)" }}>সিলেট, বাংলাদেশ</span>
            <span style={{ color: "var(--color-neutral-400)" }}>২৪/৭ হোয়াটসঅ্যাপ</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          width: "min(1240px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "14px 0 26px",
          borderTop: "1px solid var(--color-divider)",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--color-neutral-600)",
        }}
      >
        © ২০২৬ Premium Hatbazar — সব সাবস্ক্রিপশন আসল, পুরো টার্মে ওয়ারেন্টি।
      </div>
    </footer>
  );
}
