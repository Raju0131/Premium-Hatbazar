"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { PAYMENT_METHODS } from "@/lib/types";
import { displayTermLabel } from "@/lib/price";
import { bnNum } from "@/lib/bn";
import { SaleStrip } from "@/components/layout/SaleStrip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartPanel } from "@/components/layout/CartPanel";
import { Toast } from "@/components/shared/Toast";
import { submitOrder } from "@/app/actions";
import { Check } from "@phosphor-icons/react/dist/ssr";

export default function CheckoutPage() {
  const { items, total, setQty, removeItem, clearCart, showToast } = useCart();
  const [pay, setPay] = useState("bkash");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", txn: "" });
  const [orderId, setOrderId] = useState<string | null>(null);

  const payMethod = PAYMENT_METHODS.find((m) => m.key === pay)!;
  const cartEmpty = items.length === 0;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(payMethod.num);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.txn) {
      showToast("সব তথ্য পূরণ করুন");
      return;
    }
    setLoading(true);
    try {
      const id = await submitOrder({
        customerName: form.name,
        phone: form.phone,
        email: form.email,
        paymentMethod: pay,
        txnId: form.txn,
        items
      });
      setOrderId(id);
      clearCart();
      showToast(`অর্ডার ${id} কনফার্ম হয়েছে!`);
    } catch {
      showToast("অর্ডার প্লেস করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const grossSubtotal = items.reduce(
    (s, i) => s + (i.isOneTime ? i.unitPrice : i.baseMonthly * i.termMonths) * i.qty,
    0
  );
  const discount = grossSubtotal - total;

  if (orderId) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
        <SaleStrip />
        <Header />
        <main className="animate-pv-in" style={{ width: "min(1240px, calc(100% - 32px))", margin: "0 auto", padding: "60px 0 72px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, margin: "0 auto", borderRadius: "50%", background: "var(--color-accent-500)" }}>
            <Check weight="bold" size={24} color="var(--color-bg)" />
          </div>
          <h1 className="resp-h1" style={{ marginTop: 20, fontFamily: "inherit", fontSize: 44, letterSpacing: "-0.045em", color: "var(--color-neutral-100)" }}>
            অর্ডার <span style={{ color: "var(--color-accent-400)" }}>কনফার্ম!</span>
          </h1>
          <p style={{ marginTop: 10, fontSize: "14.5px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
            অর্ডার আইডি: <strong style={{ color: "var(--color-accent-300)" }}>{orderId}</strong> — হোয়াটসঅ্যাপে ১০ মিনিটের মধ্যে অ্যাকাউন্ট ডিটেইলস পাবেন।
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 24 }}>
            <Link href={`/track/${orderId}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 46, padding: "0 22px", borderRadius: 10, border: "1px solid var(--color-accent-800)", fontSize: "14.5px", fontWeight: 600, color: "var(--color-accent-300)" }}>
              অর্ডার ট্র্যাক করুন
            </Link>
            <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 46, padding: "0 22px", borderRadius: 10, border: "1.5px solid var(--color-accent-800)", fontSize: "14.5px", fontWeight: 700, color: "var(--color-accent-300)" }}>
              শপিং চালিয়ে যান
            </Link>
          </div>
        </main>
        <Footer />
        <CartPanel />
        <Toast />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
      <SaleStrip />
      <Header />

      <main className="animate-pv-in" style={{ width: "min(1240px, calc(100% - 32px))", margin: "0 auto", padding: "26px 0 72px" }}>
        <Link href="/#catalogue" style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-500)" }}>
          ← শপিং চালিয়ে যান
        </Link>
        <h1 className="resp-h1" style={{ marginTop: 16, fontFamily: "inherit", fontSize: 44, letterSpacing: "-0.045em", color: "var(--color-neutral-100)" }}>
          প্রায় <span style={{ color: "var(--color-accent-400)" }}>আপনারই।</span>
        </h1>
        <p style={{ marginTop: 10, fontSize: "14.5px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
          পেমেন্ট করার পর ট্রানজেকশন আইডি দিন — ১০ মিনিটে হোয়াটসঅ্যাপে অ্যাকাউন্ট চলে আসবে।
        </p>

        {cartEmpty ? (
          <div style={{ padding: "52px 24px", marginTop: 26, textAlign: "center", border: "1px dashed var(--color-neutral-800)", borderRadius: "var(--radius-lg)" }}>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--color-neutral-200)" }}>কার্ট খালি</div>
            <p style={{ marginTop: 7, fontSize: "13.5px", color: "var(--color-neutral-500)" }}>আগে প্রোডাক্ট যোগ করুন।</p>
            <Link href="/#catalogue" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 42, padding: "0 20px", marginTop: 16, borderRadius: 9, border: "1px solid var(--color-accent-800)", fontSize: "13.5px", fontWeight: 600, color: "var(--color-accent-300)" }}>
              প্রোডাক্ট দেখুন
            </Link>
          </div>
        ) : (
          <div className="resp-col2" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.14fr) minmax(0,.86fr)", gap: 36, marginTop: 28, alignItems: "start" }}>
            {/* Left — Form */}
            <div style={{ display: "grid", gap: 22 }}>
              {/* Step 1: Your info */}
              <div className="card" style={{ gap: 0, padding: 22, border: "1px solid var(--color-neutral-800)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: "var(--color-accent-500)", fontSize: "12px", fontWeight: 600, color: "var(--color-bg)" }}>1</span>
                  <h3 style={{ margin: 0, fontFamily: "inherit", fontSize: 18, fontWeight: 600, color: "var(--color-neutral-100)" }}>আপনার তথ্য</h3>
                </div>
                <div className="resp-pair" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginTop: 16 }}>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-neutral-400)" }}>নাম</span>
                    <input className="input" placeholder="Rifat Sarker" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </label>
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-neutral-400)" }}>হোয়াটসঅ্যাপ নম্বর</span>
                    <input className="input" placeholder="০১XXXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </label>
                </div>
                <label style={{ display: "grid", gap: 6, marginTop: 13 }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-neutral-400)" }}>ইমেইল (ডেলিভারি এই মেইলে যাবে)</span>
                  <input className="input" placeholder="you@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>
              </div>

              {/* Step 2: Payment */}
              <div className="card" style={{ gap: 0, padding: 22, border: "1px solid var(--color-neutral-800)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", background: "var(--color-accent-500)", fontSize: "12px", fontWeight: 600, color: "var(--color-bg)" }}>2</span>
                  <h3 style={{ margin: 0, fontFamily: "inherit", fontSize: 18, fontWeight: 600, color: "var(--color-neutral-100)" }}>পেমেন্ট মাধ্যম</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 128px), 1fr))", gap: 10, marginTop: 16 }}>
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setPay(m.key)}
                      style={{
                        display: "grid",
                        gap: 4,
                        padding: 13,
                        border: `1.5px solid ${pay === m.key ? "var(--color-accent-600)" : "var(--color-neutral-800)"}`,
                        borderRadius: "var(--radius-md)",
                        background: pay === m.key ? "var(--color-accent-900)" : "transparent",
                        textAlign: "left",
                        fontFamily: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontSize: "14px", fontWeight: 700, color: pay === m.key ? "var(--color-accent-300)" : "var(--color-neutral-200)" }}>{m.name}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-neutral-600)" }}>{m.sub}</span>
                    </button>
                  ))}
                </div>
                {/* Payment number */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 15px", marginTop: 14, borderRadius: "var(--radius-md)", background: "var(--color-accent-900)", border: "1px solid var(--color-accent-800)" }}>
                  <div>
                    <div style={{ fontSize: "11.5px", fontWeight: 600, letterSpacing: ".05em", color: "var(--color-accent-300)" }}>{payMethod.name} — সেন্ড মানি</div>
                    <div style={{ marginTop: 4, fontSize: "18px", fontWeight: 600, letterSpacing: ".01em", color: "var(--color-neutral-100)" }}>{payMethod.num}</div>
                  </div>
                  <button onClick={copyNumber} style={{ height: 34, padding: "0 14px", whiteSpace: "nowrap", border: "1px solid var(--color-accent-700)", borderRadius: 8, background: "transparent", fontFamily: "inherit", fontSize: "12.5px", fontWeight: 700, color: "var(--color-accent-200)", cursor: "pointer" }}>
                    {copied ? "কপি হয়েছে ✓" : "কপি করুন"}
                  </button>
                </div>
                <label style={{ display: "grid", gap: 6, marginTop: 13 }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-neutral-400)" }}>ট্রানজেকশন আইডি</span>
                  <input className="input" placeholder="8A7B2C9D1E" value={form.txn} onChange={(e) => setForm({ ...form, txn: e.target.value })} />
                </label>
              </div>
            </div>

            {/* Right — Order summary */}
            <div className="resp-unstick" style={{ position: "sticky", top: 78, padding: 20, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
              <div style={{ fontSize: "11.5px", fontWeight: 600, letterSpacing: ".05em", color: "var(--color-neutral-600)" }}>অর্ডার সামারি</div>
              <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                {items.map((c) => {
                  return (
                    <div key={c.key} style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, flexShrink: 0, borderRadius: 9, background: "var(--color-neutral-900)", fontSize: "11px", fontWeight: 600, color: "var(--color-neutral-300)" }}>{c.mark}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--color-neutral-100)" }}>{c.nameBn}</div>
                        <div style={{ marginTop: 2, fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>{displayTermLabel(c)}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7 }}>
                          <button onClick={() => setQty(c.key, c.qty - 1)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "1px solid var(--color-neutral-800)", borderRadius: 6, background: "transparent", fontFamily: "inherit", fontSize: "14px", fontWeight: 700, color: "var(--color-neutral-300)", cursor: "pointer" }}>−</button>
                          <span style={{ minWidth: 14, textAlign: "center", fontSize: "12.5px", fontWeight: 700, color: "var(--color-neutral-200)" }}>{c.qty}</span>
                          <button onClick={() => setQty(c.key, c.qty + 1)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, border: "1px solid var(--color-neutral-800)", borderRadius: 6, background: "transparent", fontFamily: "inherit", fontSize: "14px", fontWeight: 700, color: "var(--color-neutral-300)", cursor: "pointer" }}>+</button>
                          <button onClick={() => removeItem(c.key)} style={{ marginLeft: 4, padding: "4px 6px", border: 0, background: "transparent", fontFamily: "inherit", fontSize: "11.5px", fontWeight: 600, color: "var(--color-neutral-600)", cursor: "pointer" }}>remove</button>
                        </div>
                      </div>
                      <span style={{ flexShrink: 0, fontSize: "14px", fontWeight: 600, color: "var(--color-neutral-100)" }}>৳{bnNum(c.unitPrice * c.qty)}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "grid", gap: 9, marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--color-divider)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                  <span style={{ color: "var(--color-neutral-500)" }}>সাবটোটাল</span>
                  <span style={{ color: "var(--color-neutral-200)" }}>৳{bnNum(grossSubtotal)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                    <span style={{ color: "var(--color-accent-400)" }}>ডিসকাউন্ট</span>
                    <span style={{ color: "var(--color-accent-300)" }}>-৳{bnNum(discount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                  <span style={{ color: "var(--color-neutral-500)" }}>ডেলিভারি</span>
                  <span style={{ color: "var(--color-neutral-200)" }}>ফ্রি</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 6, paddingTop: 12, borderTop: "1px solid var(--color-divider)" }}>
                  <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--color-neutral-200)" }}>মোট</span>
                  <span style={{ fontSize: 27, fontWeight: 600, letterSpacing: "-0.035em", color: "var(--color-neutral-100)" }}>৳{bnNum(total)}</span>
                </div>
              </div>
              <button disabled={loading} onClick={placeOrder} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", height: 48, marginTop: 16, border: "1px solid var(--color-accent-800)", borderRadius: 10, background: loading ? "var(--color-neutral-800)" : "transparent", fontFamily: "inherit", fontSize: "14.5px", fontWeight: 600, color: loading ? "var(--color-neutral-500)" : "var(--color-accent-300)", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "প্রসেস হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
              </button>
              <p style={{ marginTop: 11, fontSize: "11.5px", fontWeight: 500, textAlign: "center", color: "var(--color-neutral-600)" }}>
                কনফার্ম করলে অর্ডার আইডি পাবেন। পুরো টার্মে রিপ্লেসমেন্ট ওয়ারেন্টি সহ।
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartPanel />
      <Toast />
    </div>
  );
}
