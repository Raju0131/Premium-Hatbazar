import { prisma } from "@/lib/prisma"
import { bnNum } from "@/lib/bn"
import Link from "next/link"

// Reads live order data, so it must never be statically prerendered at build time.
export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { items: { include: { product: true } } }
  })

  // Calculate simple stats
  const totalSales = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELLED" } }
  })
  
  const activeOrdersCount = await prisma.order.count({
    where: { status: "PENDING" }
  })

  const totalOrders = await prisma.order.count()
  const deliveredCount = await prisma.order.count({ where: { status: "DELIVERED" } })
  return (
    <div>
      <h1 style={{ margin: 0, fontFamily: "inherit", fontSize: 28, letterSpacing: "-0.03em", color: "var(--color-neutral-100)" }}>
        ড্যাশবোর্ড ওভারভিউ
      </h1>
      <p style={{ marginTop: 6, fontSize: "14px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
        আজকের সেলের সারাংশ (লাইভ ডেটা)
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginTop: 24 }}>
        {[
          { label: "মোট সেল", val: `৳${bnNum(totalSales._sum.total || 0)}`, trend: "লাইভ" },
          { label: "পেন্ডিং অর্ডার", val: `${bnNum(activeOrdersCount)}টি`, trend: "আর্জেন্ট" },
          { label: "মোট অর্ডার", val: `${bnNum(totalOrders)}টি`, trend: "সর্বমোট" },
          { label: "ডেলিভারড", val: `${bnNum(deliveredCount)}টি`, trend: "সম্পন্ন" },
        ].map((s, i) => (
          <div key={i} style={{ padding: 20, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)" }}>
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-400)" }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 8 }}>
              <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-neutral-100)" }}>{s.val}</div>
              <div style={{ padding: "4px 8px", borderRadius: 6, background: "var(--color-accent-900)", fontSize: "11px", fontWeight: 700, color: "var(--color-accent-300)" }}>{s.trend}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 24, marginTop: 32 }}>
        <div style={{ padding: 24, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)" }}>
          <h3 style={{ margin: 0, fontFamily: "inherit", fontSize: 18, fontWeight: 600, color: "var(--color-neutral-100)" }}>সাম্প্রতিক অর্ডার</h3>
          <div style={{ marginTop: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-divider)", color: "var(--color-neutral-500)" }}>
                  <th style={{ padding: "12px 0", fontWeight: 600 }}>অর্ডার আইডি</th>
                  <th style={{ padding: "12px 0", fontWeight: 600 }}>কাস্টমার</th>
                  <th style={{ padding: "12px 0", fontWeight: 600 }}>প্রোডাক্ট</th>
                  <th style={{ padding: "12px 0", fontWeight: 600 }}>টাকা</th>
                  <th style={{ padding: "12px 0", fontWeight: 600 }}>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--color-neutral-300)" }}>
                {recentOrders.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid var(--color-neutral-900)" }}>
                    <td style={{ padding: "16px 0", fontWeight: 600 }}>
                      <Link href={`/admin/orders/${row.id}`} style={{ color: "var(--color-accent-300)" }}>{row.orderId}</Link>
                    </td>
                    <td style={{ padding: "16px 0" }}>{row.customerName}</td>
                    <td style={{ padding: "16px 0" }}>
                      {row.items.map(i => `${i.product.nameBn} (${bnNum(i.termMonths)}m x${bnNum(i.qty)})`).join(", ")}
                    </td>
                    <td style={{ padding: "16px 0" }}>৳{bnNum(row.total)}</td>
                    <td style={{ padding: "16px 0" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 12, background: "var(--color-neutral-900)", fontSize: "11px", fontWeight: 600, color: row.status === "PENDING" ? "var(--color-accent-300)" : "var(--color-neutral-500)" }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
