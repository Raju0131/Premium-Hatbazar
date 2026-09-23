import { getMessages } from "@/lib/queries";
import { markMessageRead } from "@/app/admin/actions";
import { bnNum, toBn } from "@/lib/bn";

export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return toBn(
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  );
}

export default async function AdminMessages() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <h1 style={{ margin: 0, fontFamily: "inherit", fontSize: 28, letterSpacing: "-0.03em", color: "var(--color-neutral-100)" }}>
        কাস্টমার মেসেজ
      </h1>
      <p style={{ marginTop: 6, fontSize: "14px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
        মোট {bnNum(messages.length)}টি · <span style={{ color: "var(--color-accent-400)" }}>{bnNum(unread)}টি নতুন</span>
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 24, maxWidth: 760 }}>
        {messages.map((m) => {
          const wa = m.phone ? `https://wa.me/${m.phone.replace(/[^0-9]/g, "")}` : null;
          return (
            <div
              key={m.id}
              style={{
                padding: 18,
                border: `1px solid ${m.read ? "var(--color-neutral-800)" : "var(--color-accent-800)"}`,
                borderRadius: "var(--radius-lg)",
                background: m.read ? "var(--color-surface)" : "var(--color-accent-900)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  {!m.read && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent-400)" }} />}
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-neutral-100)" }}>{m.name || "অজ্ঞাত"}</span>
                  {m.phone && <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-500)" }}>· {m.phone}</span>}
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-neutral-600)" }}>{fmt(m.createdAt)}</span>
              </div>

              <p style={{ margin: "10px 0 0", fontSize: "14px", lineHeight: 1.65, color: "var(--color-neutral-300)", whiteSpace: "pre-wrap" }}>
                {m.body}
              </p>

              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <form action={markMessageRead.bind(null, m.id, !m.read)}>
                  <button
                    type="submit"
                    style={{ height: 34, padding: "0 14px", border: "1px solid var(--color-neutral-800)", borderRadius: 8, background: "transparent", fontFamily: "inherit", fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-300)", cursor: "pointer" }}
                  >
                    {m.read ? "নতুন করে চিহ্নিত" : "পড়া হয়েছে চিহ্নিত করুন"}
                  </button>
                </form>
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", height: 34, padding: "0 14px", border: "1px solid var(--color-accent-800)", borderRadius: 8, fontSize: "12.5px", fontWeight: 600, color: "var(--color-accent-300)", textDecoration: "none" }}
                  >
                    হোয়াটসঅ্যাপে রিপ্লাই
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {messages.length === 0 && (
          <div style={{ padding: "44px 20px", textAlign: "center", border: "1px dashed var(--color-neutral-800)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-neutral-300)" }}>কোনো মেসেজ নেই</div>
            <p style={{ marginTop: 6, fontSize: "13px", color: "var(--color-neutral-600)" }}>চ্যাট উইজেট থেকে কাস্টমার মেসেজ দিলে এখানে আসবে।</p>
          </div>
        )}
      </div>
    </div>
  );
}
