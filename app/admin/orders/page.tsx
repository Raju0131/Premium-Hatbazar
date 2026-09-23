import Link from "next/link";
import { getOrders } from "@/lib/queries";
import { bnNum, toBn } from "@/lib/bn";
import { ORDER_STATUS_BN, orderStatusStyle } from "@/lib/orderStatus";

export const dynamic = "force-dynamic";

function fmtDate(d: Date) {
  return toBn(
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  );
}

const th: React.CSSProperties = { padding: "12px 10px", fontWeight: 600, whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "14px 10px", verticalAlign: "top" };

export default async function AdminOrders() {
  const orders = await getOrders();

  return (
    <div>
      <h1 style={{ margin: 0, fontFamily: "inherit", fontSize: 28, letterSpacing: "-0.03em", color: "var(--color-neutral-100)" }}>
        অর্ডার ম্যানেজমেন্ট
      </h1>
      <p style={{ marginTop: 6, fontSize: "14px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
        মোট {bnNum(orders.length)}টি অর্ডার — আইডিতে ক্লিক করে স্ট্যাটাস আপডেট করুন
      </p>

      <div style={{ marginTop: 24, padding: 8, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px", minWidth: 720 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-divider)", color: "var(--color-neutral-500)" }}>
              <th style={th}>অর্ডার</th>
              <th style={th}>কাস্টমার</th>
              <th style={th}>প্রোডাক্ট</th>
              <th style={th}>টাকা</th>
              <th style={th}>স্ট্যাটাস</th>
              <th style={th}>তারিখ</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-neutral-300)" }}>
            {orders.map((o) => {
              const s = orderStatusStyle(o.status);
              return (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--color-neutral-900)" }}>
                  <td style={{ ...td, fontWeight: 600 }}>
                    <Link href={`/admin/orders/${o.id}`} style={{ color: "var(--color-accent-300)" }}>{o.orderId}</Link>
                  </td>
                  <td style={td}>
                    <div style={{ color: "var(--color-neutral-100)", fontWeight: 600 }}>{o.customerName}</div>
                    <div style={{ fontSize: "12px", color: "var(--color-neutral-600)" }}>{o.phone}</div>
                  </td>
                  <td style={{ ...td, maxWidth: 260, color: "var(--color-neutral-400)" }}>
                    {o.items.map((i) => `${i.product.nameBn} ×${bnNum(i.qty)}`).join(", ")}
                  </td>
                  <td style={{ ...td, fontWeight: 600, color: "var(--color-neutral-100)" }}>৳{bnNum(o.total)}</td>
                  <td style={td}>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 12, background: s.bg, color: s.fg, fontSize: "11px", fontWeight: 700 }}>
                      {ORDER_STATUS_BN[o.status]}
                    </span>
                  </td>
                  <td style={{ ...td, fontSize: "12.5px", color: "var(--color-neutral-500)", whiteSpace: "nowrap" }}>{fmtDate(o.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div style={{ padding: "44px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-neutral-300)" }}>কোনো অর্ডার নেই</div>
            <p style={{ marginTop: 6, fontSize: "13px", color: "var(--color-neutral-600)" }}>চেকআউট থেকে অর্ডার এলে এখানে দেখা যাবে।</p>
          </div>
        )}
      </div>
    </div>
  );
}
