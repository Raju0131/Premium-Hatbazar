"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChatCircleDots, X, PaperPlaneTilt, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { sendChatMessage } from "@/app/actions";

const WHATSAPP = "8801315152005";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Customer-facing only — not on the admin panel.
  if (pathname.startsWith("/admin")) return null;

  const send = async () => {
    if (!body.trim()) return;
    setSending(true);
    try {
      const res = await sendChatMessage({ name, phone, body });
      if (res.ok) {
        setSent(true);
        setBody("");
      }
    } catch {
      /* ignore — widget stays usable */
    } finally {
      setSending(false);
    }
  };

  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(body || "আসসালামু আলাইকুম, একটা প্রশ্ন ছিল —")}`;

  return (
    <>
      {open && (
        <div
          className="animate-ph-in"
          role="dialog"
          aria-label="সাপোর্ট চ্যাট"
          style={{
            position: "fixed",
            right: 20,
            bottom: 86,
            zIndex: 88,
            width: "min(340px, calc(100vw - 32px))",
            display: "flex",
            flexDirection: "column",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-neutral-800)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "14px 16px", background: "linear-gradient(122deg, var(--color-section), var(--color-section-glow))" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", background: "var(--color-bg)", color: "var(--color-accent-300)" }}>
                <ChatCircleDots weight="bold" size={18} />
              </span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-neutral-100)" }}>Premium Hatbazar সাপোর্ট</div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-accent-200)" }}>গড় রিপ্লাই ৪ মিনিট</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="চ্যাট বন্ধ করুন" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, border: 0, borderRadius: 8, background: "rgba(0,0,0,.25)", color: "var(--color-neutral-100)", cursor: "pointer" }}>
              <X weight="bold" size={14} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: 16, display: "grid", gap: 10 }}>
            {sent ? (
              <div style={{ padding: "18px 6px", textAlign: "center" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-neutral-100)" }}>পেয়েছি! ✓</div>
                <p style={{ marginTop: 6, fontSize: "13px", color: "var(--color-neutral-400)", lineHeight: 1.6 }}>
                  আপনার মেসেজ পৌঁছে গেছে। হোয়াটসঅ্যাপে দ্রুত রিপ্লাই পাবেন।
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{ marginTop: 12, height: 38, padding: "0 16px", border: "1px solid var(--color-accent-800)", borderRadius: 9, background: "transparent", fontFamily: "inherit", fontSize: "13px", fontWeight: 600, color: "var(--color-accent-300)", cursor: "pointer" }}
                >
                  আরেকটা মেসেজ
                </button>
              </div>
            ) : (
              <>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--color-neutral-400)", lineHeight: 1.6 }}>
                  কী লাগবে লিখুন — আমরা দেখে রিপ্লাই দেব।
                </p>
                <input
                  className="input"
                  placeholder="নাম (ঐচ্ছিক)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="নাম"
                />
                <input
                  className="input"
                  placeholder="হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-label="হোয়াটসঅ্যাপ নম্বর"
                />
                <textarea
                  className="input"
                  placeholder="আপনার মেসেজ..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  aria-label="মেসেজ"
                  style={{ resize: "vertical", lineHeight: 1.6 }}
                />
                <button
                  onClick={send}
                  disabled={sending || !body.trim()}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    height: 42, border: "1px solid var(--color-accent-800)", borderRadius: 9,
                    background: sending ? "var(--color-neutral-800)" : "transparent",
                    fontFamily: "inherit", fontSize: "14px", fontWeight: 600,
                    color: !body.trim() ? "var(--color-neutral-600)" : "var(--color-accent-300)",
                    cursor: sending || !body.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  <PaperPlaneTilt weight="bold" size={15} /> {sending ? "পাঠানো হচ্ছে..." : "পাঠান"}
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, height: 40, borderRadius: 9, border: "1px solid var(--color-neutral-800)", fontSize: "13px", fontWeight: 600, color: "var(--color-neutral-300)", textDecoration: "none" }}
                >
                  <WhatsappLogo weight="bold" size={16} /> সরাসরি হোয়াটসঅ্যাপে
                </a>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "চ্যাট বন্ধ করুন" : "সাপোর্টে মেসেজ দিন"}
        aria-expanded={open}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 88,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "1px solid var(--color-accent-700)",
          background: "var(--color-accent-500)",
          color: "var(--color-bg)",
          boxShadow: "var(--shadow-lg)",
          cursor: "pointer",
        }}
      >
        {open ? <X weight="bold" size={22} /> : <ChatCircleDots weight="bold" size={24} />}
      </button>
    </>
  );
}
