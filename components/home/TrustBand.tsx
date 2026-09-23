import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function TrustBand() {
  const items = [
    { title: "শুধু আসল", desc: "শেয়ার্ড লগইন নেই, ক্র্যাক নেই। আসল সাবস্ক্রিপশন।" },
    { title: "দেশি পেমেন্ট", desc: "বিকাশ, নগদ, রকেট, বাইন্যান্স — যেটা সহজ।" },
    { title: "ফ্রি রিপ্লেসমেন্ট", desc: "অ্যাকাউন্টে সমস্যা হলেই পুরো টার্মে ফ্রি রিপ্লেসমেন্ট।" },
    { title: "মানুষের সাপোর্ট", desc: "হোয়াটসঅ্যাপে ২৪/৭, গড় রিপ্লাই ৪ মিনিট।" },
  ];

  return (
    <div
      style={{
        borderTop: "1px solid var(--color-divider)",
        borderBottom: "1px solid var(--color-divider)",
        background: "var(--color-surface)",
      }}
    >
      <ScrollReveal
        className="resp-col4 resp-stats"
        style={{
          width: "min(1240px, calc(100% - 32px))",
          margin: "0 auto",
          padding: "26px 0",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 20,
        }}
      >
        {items.map((item) => (
          <div key={item.title}>
            <div
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                letterSpacing: ".03em",
                color: "var(--color-accent-400)",
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: "13.5px",
                fontWeight: 500,
                color: "var(--color-neutral-400)",
              }}
            >
              {item.desc}
            </div>
          </div>
        ))}
      </ScrollReveal>
    </div>
  );
}
