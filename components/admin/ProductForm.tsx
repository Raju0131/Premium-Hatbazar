"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { createProduct, updateProduct, type ProductFormData } from "@/app/admin/actions";

const categories = CATEGORIES.filter((c) => c !== "All");

const labelStyle: React.CSSProperties = { fontSize: "12px", fontWeight: 700, color: "var(--color-neutral-400)" };

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={labelStyle}>
        {label}
        {hint && <span style={{ fontWeight: 500, color: "var(--color-neutral-600)" }}> — {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [f, setF] = useState({
    slug: product?.slug ?? "",
    nameBn: product?.nameBn ?? "",
    category: product?.category ?? categories[0],
    mark: product?.mark ?? "",
    monthlyPrice: product ? String(product.monthlyPrice) : "",
    isOneTime: product?.isOneTime ?? false,
    unitLabel: product?.unitLabel ?? "",
    badge: product?.badge ?? "",
    deliveryEta: product?.deliveryEta ?? "ইনস্ট্যান্ট",
    stock: product ? String(product.stock) : "0",
    wasPrice: product?.wasPrice != null ? String(product.wasPrice) : "",
    imageUrl: product?.imageUrl ?? "",
    metaBn: product?.metaBn ?? "",
    aboutBn: product?.aboutBn ?? "",
    specs: (product?.specs ?? []).map((s) => `${s.k}: ${s.v}`).join("\n"),
    includes: (product?.includes ?? []).join("\n"),
  });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!f.slug.trim() || !f.nameBn.trim() || !f.mark.trim()) {
      setError("slug, নাম আর mark — তিনটাই দিতে হবে।");
      return;
    }
    const price = parseInt(f.monthlyPrice, 10);
    if (Number.isNaN(price) || price < 0) {
      setError("দাম একটা সঠিক সংখ্যা দিন।");
      return;
    }

    const specs = f.specs
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const idx = line.indexOf(":");
        return idx >= 0
          ? { k: line.slice(0, idx).trim(), v: line.slice(idx + 1).trim() }
          : { k: line, v: "" };
      });
    const includes = f.includes.split("\n").map((l) => l.trim()).filter(Boolean);

    const data: ProductFormData = {
      slug: f.slug.trim(),
      nameBn: f.nameBn.trim(),
      category: f.category,
      mark: f.mark.trim(),
      monthlyPrice: price,
      isOneTime: f.isOneTime,
      unitLabel: f.unitLabel.trim(),
      badge: f.badge.trim(),
      deliveryEta: f.deliveryEta.trim(),
      stock: parseInt(f.stock, 10) || 0,
      aboutBn: f.aboutBn.trim(),
      metaBn: f.metaBn.trim(),
      wasPrice: f.wasPrice.trim() ? parseInt(f.wasPrice, 10) : null,
      imageUrl: f.imageUrl.trim() || null,
      specs,
      includes,
    };

    setSaving(true);
    try {
      if (product) await updateProduct(product.id, data);
      else await createProduct(data);
      router.push("/admin/products");
      router.refresh();
    } catch {
      setSaving(false);
      setError("সেভ করা যায়নি — slug হয়তো আগেই আছে (ইউনিক হতে হবে)।");
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 22, maxWidth: 720 }}>
      <div className="card" style={{ gap: 14, padding: 22, border: "1px solid var(--color-neutral-800)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="নাম">
            <input className="input" value={f.nameBn} onChange={set("nameBn")} placeholder="ChatGPT Plus" />
          </Field>
          <Field label="Slug" hint="URL-এ যাবে, ইউনিক">
            <input className="input" value={f.slug} onChange={set("slug")} placeholder="chatgpt-plus" />
          </Field>
          <Field label="Mark" hint="২–৩ অক্ষর">
            <input className="input" value={f.mark} onChange={set("mark")} placeholder="GPT" />
          </Field>
          <Field label="ক্যাটাগরি">
            <select className="input" value={f.category} onChange={set("category")}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="মাসিক দাম (৳)">
            <input className="input" type="number" value={f.monthlyPrice} onChange={set("monthlyPrice")} placeholder="1150" />
          </Field>
          <Field label="আগের দাম / was (৳)" hint="ঐচ্ছিক">
            <input className="input" type="number" value={f.wasPrice} onChange={set("wasPrice")} placeholder="1520" />
          </Field>
          <Field label="স্টক">
            <input className="input" type="number" value={f.stock} onChange={set("stock")} placeholder="34" />
          </Field>
          <Field label="ব্যাজ" hint="যেমন ইনস্ট্যান্ট / −১৮%">
            <input className="input" value={f.badge} onChange={set("badge")} placeholder="ইনস্ট্যান্ট" />
          </Field>
          <Field label="ডেলিভারি">
            <input className="input" value={f.deliveryEta} onChange={set("deliveryEta")} placeholder="ইনস্ট্যান্ট" />
          </Field>
          <Field label="ইউনিট লেবেল" hint="one-time হলে, যেমন / ১০০ ডায়া">
            <input className="input" value={f.unitLabel} onChange={set("unitLabel")} placeholder="/ ১০০ ডায়া" />
          </Field>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={f.isOneTime}
            onChange={(e) => setF((p) => ({ ...p, isOneTime: e.target.checked }))}
            style={{ width: 16, height: 16, accentColor: "var(--color-accent-500)" }}
          />
          <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--color-neutral-200)" }}>
            এক-বারের প্রোডাক্ট (টপ-আপ / গিফট কার্ড — টার্ম ছাড়া)
          </span>
        </label>

        <Field label="ইমেজ URL" hint="https:// — DB-তেও বসানো যায়">
          <input className="input" value={f.imageUrl} onChange={set("imageUrl")} placeholder="https://your-host.com/gpt.png" />
        </Field>
        <Field label="মেটা লাইন">
          <input className="input" value={f.metaBn} onChange={set("metaBn")} placeholder="এআই টুলস · প্রাইভেট মেইল" />
        </Field>
        <Field label="বিবরণ (about)">
          <textarea className="input" value={f.aboutBn} onChange={set("aboutBn")} rows={3} style={{ resize: "vertical", lineHeight: 1.6 }} />
        </Field>
        <Field label="স্পেক" hint="প্রতি লাইনে একটা — key: value">
          <textarea className="input" value={f.specs} onChange={set("specs")} rows={4} placeholder={"অ্যাকাউন্ট: প্রাইভেট\nশেয়ারিং: নেই"} style={{ resize: "vertical", lineHeight: 1.6 }} />
        </Field>
        <Field label="কী কী থাকবে (includes)" hint="প্রতি লাইনে একটা">
          <textarea className="input" value={f.includes} onChange={set("includes")} rows={4} placeholder={"নিজের মেইলে অ্যাকাউন্ট\nফ্রি রিপ্লেসমেন্ট"} style={{ resize: "vertical", lineHeight: 1.6 }} />
        </Field>
      </div>

      {error && (
        <div style={{ padding: "11px 14px", borderRadius: "var(--radius-md)", background: "var(--color-accent-900)", border: "1px solid var(--color-accent-800)", fontSize: "13px", fontWeight: 600, color: "var(--color-accent-200)" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="submit"
          disabled={saving}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 44, padding: "0 22px", border: "1px solid var(--color-accent-800)", borderRadius: 10,
            background: saving ? "var(--color-neutral-800)" : "transparent",
            fontFamily: "inherit", fontSize: "14px", fontWeight: 600,
            color: saving ? "var(--color-neutral-500)" : "var(--color-accent-300)", cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "সেভ হচ্ছে..." : product ? "আপডেট করুন" : "প্রোডাক্ট যোগ করুন"}
        </button>
        <Link
          href="/admin/products"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 44, padding: "0 20px", border: "1px solid var(--color-neutral-800)", borderRadius: 10,
            fontSize: "14px", fontWeight: 600, color: "var(--color-neutral-300)", textDecoration: "none",
          }}
        >
          বাতিল
        </Link>
      </div>
    </form>
  );
}
