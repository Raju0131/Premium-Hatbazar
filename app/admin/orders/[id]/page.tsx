import Link from "next/link";
import { notFound } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { getOrder } from "@/lib/queries";
import { setOrderStatus } from "@/app/admin/actions";
import { bnNum } from "@/lib/bn";
import { displayTermLabel } from "@/lib/price";
import { PAYMENT_METHODS } from "@/lib/types";
import { ORDER_STATUSES, ORDER_STATUS_BN, orderStatusStyle } from "@/lib/orderStatus";

export const dynamic = "force-dynamic";

const label: React.CSSProperties = { fontSize: "11.5px", fontWeight: 600, letterSpacing: ".04em", color: "var(--color-neutral-600)" };
const value: React.CSSProperties = { marginTop: 3, fontSize: "14px", fontWeight: 600, color: "var(--color-neutral-100)" };

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const payName = PAYMENT_METHODS.find((m) => m.key === order.paymentMethod)?.name ?? order.paymentMethod;
  const cur = orderStatusStyle(order.status);

  return (
    <div>
      <Link href="/admin/orders" style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-500)" }}>
        ← সব অর্ডার
      </Link>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 12 }}>
        <h1 style={{ margin: 0, fontFamily: "inherit", fontSize: 26, letterSpacing: "-0.03em", color: "var(--color-neutral-100)" }}>
          {order.orderId}
        </h1>
        <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 12, background: cur.bg, color: cur.fg, fontSize: "12px", fontWeight: 700 }}>
          {ORDER_STATUS_BN[order.status]}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: 20, marginTop: 22, alignItems: "start" }}>
        {/* Items + totals */}
        <div style={{ padding: 20, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)" }}>
          <div style={label}>আইটেম</div>
          <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
            {order.items.map((i) => (
              <div key={i.id} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, flexShrink: 0, borderRadius: 9, background: "var(--color-neutral-900)", fontSize: "11px", fontWeight: 600, color: "var(--color-neutral-300)" }}>
                  {i.product.mark}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--color-neutral-100)" }}>{i.product.nameBn}</div>
                  <div style={{ marginTop: 2, fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>
                    {displayTermLabel({ isOneTime: i.product.isOneTime, termMonths: i.termMonths, unitLabel: i.product.unitLabel })} · ×{bnNum(i.qty)}
                  </div>
                </div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-neutral-100)" }}>৳{bnNum(i.unitPrice * i.qty)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gap: 8, marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--color-divider)", fontSize: "13px", fontWeight: 600 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-neutral-500)" }}>সাবটোটাল</span>
              <span style={{ color: "var(--color-neutral-200)" }}>৳{bnNum(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--color-accent-400)" }}>ডিসকাউন্ট</span>
                <span style={{ color: "var(--color-accent-300)" }}>-৳{bnNum(order.discount)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingTop: 10, borderTop: "1px solid var(--color-divider)" }}>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-neutral-200)" }}>মোট</span>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-neutral-100)" }}>৳{bnNum(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer + payment + status controls */}
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ padding: 20, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)" }}>
            <div style={label}>কাস্টমার</div>
            <div style={value}>{order.customerName}</div>
            <div style={{ marginTop: 10, ...label }}>হোয়াটসঅ্যাপ</div>
            <div style={value}>{order.phone}</div>
            <div style={{ marginTop: 10, ...label }}>ইমেইল</div>
            <div style={{ ...value, wordBreak: "break-all" }}>{order.email || "—"}</div>
          </div>

          <div style={{ padding: 20, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)" }}>
            <div style={label}>পেমেন্ট</div>
            <div style={value}>{payName}</div>
            <div style={{ marginTop: 10, ...label }}>ট্রানজেকশন আইডি</div>
            <div style={{ ...value, wordBreak: "break-all", color: "var(--color-accent-300)" }}>{order.txnId}</div>
          </div>

          <div style={{ padding: 20, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)" }}>
            <div style={label}>স্ট্যাটাস আপডেট</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {ORDER_STATUSES.map((s) => {
                const active = s === order.status;
                return (
                  <form key={s} action={setOrderStatus.bind(null, order.id, s as OrderStatus)}>
                    <button
                      type="submit"
                      disabled={active}
                      style={{
                        width: "100%",
                        height: 40,
                        border: `1px solid ${active ? "var(--color-accent-600)" : "var(--color-neutral-800)"}`,
                        borderRadius: 9,
                        background: active ? "var(--color-accent-900)" : "transparent",
                        fontFamily: "inherit",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: active ? "var(--color-accent-300)" : "var(--color-neutral-300)",
                        cursor: active ? "default" : "pointer",
                      }}
                    >
                      {ORDER_STATUS_BN[s]}
                    </button>
                  </form>
                );
              })}
            </div>
            <p style={{ marginTop: 11, fontSize: "11.5px", fontWeight: 500, color: "var(--color-neutral-600)" }}>
              ডেলিভারি দেওয়ার পর “ডেলিভারড” চাপুন — কাস্টমার ট্র্যাক পেজে দেখবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
