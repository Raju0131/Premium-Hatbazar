import Link from "next/link";
import { getProducts } from "@/lib/queries";
import { bnNum } from "@/lib/bn";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

const th: React.CSSProperties = { padding: "12px 10px", fontWeight: 600, whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 10px", verticalAlign: "middle" };

export default async function AdminProducts() {
  const products = await getProducts();

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "inherit", fontSize: 28, letterSpacing: "-0.03em", color: "var(--color-neutral-100)" }}>
            প্রোডাক্ট ক্যাটালগ
          </h1>
          <p style={{ marginTop: 6, fontSize: "14px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
            মোট {bnNum(products.length)}টি প্রোডাক্ট
          </p>
        </div>
        <Link
          href="/admin/products/new"
          style={{ display: "flex", alignItems: "center", height: 40, padding: "0 18px", border: "1px solid var(--color-accent-800)", borderRadius: 9, fontSize: "13.5px", fontWeight: 600, color: "var(--color-accent-300)" }}
        >
          + নতুন প্রোডাক্ট
        </Link>
      </div>

      <div style={{ marginTop: 24, padding: 8, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px", minWidth: 640 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-divider)", color: "var(--color-neutral-500)" }}>
              <th style={th}>প্রোডাক্ট</th>
              <th style={th}>দাম</th>
              <th style={th}>স্টক</th>
              <th style={th}>ইমেজ</th>
              <th style={{ ...th, textAlign: "right" }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-neutral-300)" }}>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--color-neutral-900)" }}>
                <td style={td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "var(--color-neutral-900)", fontSize: "11px", fontWeight: 600, color: "var(--color-neutral-300)" }}>
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        p.mark
                      )}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--color-neutral-100)" }}>{p.nameBn}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--color-neutral-600)" }}>{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...td, fontWeight: 600, color: "var(--color-neutral-100)", whiteSpace: "nowrap" }}>
                  ৳{bnNum(p.monthlyPrice)}
                  {p.isOneTime && <span style={{ marginLeft: 4, fontSize: "11px", fontWeight: 600, color: "var(--color-neutral-600)" }}>{p.unitLabel}</span>}
                </td>
                <td style={td}>{bnNum(p.stock)}</td>
                <td style={td}>
                  {p.imageUrl ? (
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-accent-400)" }}>আছে</span>
                  ) : (
                    <span style={{ fontSize: "12px", color: "var(--color-neutral-600)" }}>—</span>
                  )}
                </td>
                <td style={{ ...td, textAlign: "right", whiteSpace: "nowrap" }}>
                  <Link href={`/admin/products/${p.id}`} style={{ marginRight: 10, fontSize: "12.5px", fontWeight: 600, color: "var(--color-accent-300)" }}>
                    এডিট
                  </Link>
                  <DeleteProductButton id={p.id} name={p.nameBn} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
