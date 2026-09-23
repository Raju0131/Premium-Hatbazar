import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "প্রোডাক্ট বাছুন",
      desc: "টার্ম বেছে নিন — ১, ৩ বা ১২ মাস। লম্বা টার্মে প্রতি মাসের খরচ কম পড়ে।",
    },
    {
      num: "02",
      title: "বিকাশে পেমেন্ট করুন",
      desc: "সেন্ড মানি করুন, ট্রানজেকশন আইডি ফর্মে বসিয়ে দিন। আর কিছু না।",
    },
    {
      num: "03",
      title: "১০ মিনিটে লগইন পান",
      desc: "হোয়াটসঅ্যাপে অ্যাকাউন্ট ডিটেইলস চলে আসবে। অর্ডার আইডি দিয়ে ট্র্যাক করতে পারবেন।",
    },
  ];

  return (
    <section
      id="how"
      className="resp-sec"
      style={{
        width: "min(1240px, calc(100% - 32px))",
        margin: "0 auto",
        padding: "64px 0 0",
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
        কিভাবে কাজ করে
      </h2>
      <p style={{ marginTop: 7, fontSize: "14px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
        অর্ডার থেকে ডেলিভারি — তিনটি ধাপ, ১০ মিনিট।
      </p>

      <ScrollReveal
        className="resp-col3"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0,1fr))",
          gap: 1,
          marginTop: 22,
          background: "var(--color-divider)",
          border: "1px solid var(--color-neutral-800)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        {steps.map((s) => (
          <div key={s.num} style={{ padding: "24px 22px", background: "var(--color-surface)" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: ".12em",
                color: "var(--color-accent-400)",
              }}
            >
              {s.num}
            </div>
            <div
              style={{
                marginTop: 12,
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--color-neutral-100)",
              }}
            >
              {s.title}
            </div>
            <p
              style={{
                marginTop: 8,
                fontSize: "13.5px",
                fontWeight: 500,
                color: "var(--color-neutral-400)",
              }}
            >
              {s.desc}
            </p>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
