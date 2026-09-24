"use client";

import { useState, useEffect, useCallback } from "react";
import { SaleStrip } from "@/components/layout/SaleStrip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartPanel } from "@/components/layout/CartPanel";
import { Toast } from "@/components/shared/Toast";
import { getOrderStatus } from "@/app/actions";
import { use } from "react";
import type { OrderStatus } from "@prisma/client";

function getSteps(status: OrderStatus | null) {
  if (!status) return [];
  const level = status === "CANCELLED" ? 0 : status === "PENDING" ? 1 : status === "VERIFIED" ? 2 : 4;
  return [
    { t: "অর্ডার গ্রহণ", time: "", done: level >= 1 },
    { t: "পেমেন্ট ভেরিফাই", time: "", done: level >= 2 },
    { t: "অ্যাকাউন্ট রেডি", time: "", done: level >= 3 },
    { t: "হোয়াটসঅ্যাপে ডেলিভারি", time: "", done: level >= 4 },
  ];
}

export default function TrackPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [trackId, setTrackId] = useState(orderId || "");
  const [tracked, setTracked] = useState(false);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = useCallback(async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const s = await getOrderStatus(id);
      setStatus(s);
      setTracked(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-track when landed on /track/PH-XXXX (skip the bare /track/search entry point).
  useEffect(() => {
    if (orderId && orderId !== "search") {
      handleTrack(orderId);
    }
  }, [orderId, handleTrack]);

  const steps = getSteps(status);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
      <SaleStrip />
      <Header />

      <main className="animate-ph-in" style={{ width: "min(1240px, calc(100% - 32px))", margin: "0 auto", padding: "26px 0 72px" }}>
        <div className="resp-col2" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.16fr) minmax(0,.84fr)", gap: 36, alignItems: "start" }}>
          <div>
            <h1 className="resp-h1" style={{ margin: 0, fontFamily: "inherit", fontSize: 44, letterSpacing: "-0.045em", color: "var(--color-neutral-100)" }}>
              আমার অর্ডার <span style={{ color: "var(--color-accent-400)" }}>কোথায়?</span>
            </h1>
            <p style={{ marginTop: 11, maxWidth: "50ch", fontSize: "14.5px", fontWeight: 500, color: "var(--color-neutral-500)" }}>
              অর্ডার আইডি দিলেই লাইভ স্ট্যাটাস দেখবেন। হোয়াটসঅ্যাপেও আপডেট পাঠাই।
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 22, maxWidth: 440 }}>
              <input className="input" placeholder="PH-8241" value={trackId} onChange={(e) => setTrackId(e.target.value)} style={{ flex: 1, minWidth: 170, height: 44, fontWeight: 600 }} />
              <button disabled={loading} onClick={() => handleTrack(trackId)} style={{ height: 44, padding: "0 20px", whiteSpace: "nowrap", border: "1px solid var(--color-accent-800)", borderRadius: 9, background: "transparent", fontFamily: "inherit", fontSize: "13.5px", fontWeight: 600, color: "var(--color-accent-300)", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "..." : "ট্র্যাক"}
              </button>
            </div>

            {tracked && (
              <div style={{ marginTop: 30, padding: 22, border: "1px solid var(--color-neutral-800)", borderRadius: "var(--radius-lg)", background: "var(--color-surface)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 18, borderBottom: "1px solid var(--color-divider)" }}>
                  <div>
                    <div style={{ fontSize: "11.5px", fontWeight: 600, letterSpacing: ".05em", color: "var(--color-neutral-600)" }}>অর্ডার</div>
                    <div style={{ marginTop: 5, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--color-neutral-100)" }}>{trackId}</div>
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 13px", borderRadius: 20, background: "var(--color-accent-900)", border: "1px solid var(--color-accent-800)" }}>
                    {status !== "DELIVERED" && status !== "CANCELLED" && <span className="animate-ph-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-accent-400)" }} />}
                    <span style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--color-accent-200)" }}>{status || "Not Found"}</span>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 0, marginTop: 18 }}>
                  {status ? steps.map((s, i) => {
                    const isLast = i === steps.length - 1;
                    return (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr)", gap: 14 }}>
                        <div style={{ display: "grid", justifyItems: "center", gap: 0 }}>
                          <span style={{
                            display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%",
                            background: s.done ? "var(--color-accent-500)" : "transparent",
                            border: `1.5px solid ${s.done ? "var(--color-accent-500)" : "var(--color-neutral-800)"}`,
                            fontSize: "11px", fontWeight: 600,
                            color: s.done ? "var(--color-bg)" : "var(--color-neutral-600)",
                          }}>
                            {s.done ? "✓" : (i + 1)}
                          </span>
                          {!isLast && (
                            <span style={{ width: 1.5, flex: 1, minHeight: 20, background: s.done ? "var(--color-accent-700)" : "var(--color-neutral-800)" }} />
                          )}
                        </div>
                        <div style={{ paddingBottom: isLast ? 0 : 18 }}>
                          <div style={{ fontSize: "15px", fontWeight: 700, color: s.done ? "var(--color-neutral-100)" : "var(--color-neutral-600)" }}>{s.t}</div>
                          <div style={{ marginTop: 3, fontSize: "12.5px", fontWeight: 600, color: "var(--color-neutral-600)" }}>{s.time}</div>
                        </div>
                      </div>
                    );
                  }) : <div style={{ fontSize: "14px", color: "var(--color-neutral-400)" }}>অর্ডারটি পাওয়া যায়নি।</div>}
                </div>
              </div>
            )}
          </div>

          {/* Help card */}
          <div className="card" style={{ gap: 0, padding: 22, border: "1px solid var(--color-neutral-800)" }}>
            <h2 style={{ margin: 0, fontFamily: "inherit", fontSize: "17px", fontWeight: 600, color: "var(--color-neutral-100)" }}>দেরি হচ্ছে?</h2>
            <p style={{ marginTop: 9, fontFamily: "var(--font-body)", fontSize: "14.5px", lineHeight: 1.7, color: "var(--color-neutral-400)" }}>
              বেশিরভাগ অর্ডার ১০ মিনিটে হয়ে যায়। রাশ আওয়ারে ৩০ মিনিট পর্যন্ত লাগতে পারে। ১ ঘণ্টা পেরিয়ে গেলে সরাসরি হোয়াটসঅ্যাপ করুন — অর্ডার আইডিটা সাথে দিন।
            </p>
            <a href="#order" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: 44, marginTop: 16, borderRadius: 9, border: "1px solid var(--color-accent-800)", fontSize: "13.5px", fontWeight: 600, color: "var(--color-accent-300)" }}>
              হোয়াটসঅ্যাপ — +৮৮০ ১৩১৫ ১৫২০০৫
            </a>
            <div style={{ display: "grid", gap: 10, marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--color-divider)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
                <span style={{ color: "var(--color-neutral-500)" }}>গড় ডেলিভারি</span>
                <span style={{ color: "var(--color-neutral-200)" }}>৮ মিনিট</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
                <span style={{ color: "var(--color-neutral-500)" }}>রিপ্লাই টাইম</span>
                <span style={{ color: "var(--color-neutral-200)" }}>৪ মিনিট</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600 }}>
                <span style={{ color: "var(--color-neutral-500)" }}>সাপোর্ট আওয়ার</span>
                <span style={{ color: "var(--color-neutral-200)" }}>২৪/৭</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartPanel />
      <Toast />
    </div>
  );
}
