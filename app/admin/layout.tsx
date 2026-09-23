import { Header } from "@/components/layout/Header";
import { Toast } from "@/components/shared/Toast";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", fontFamily: "var(--font-body)", color: "var(--color-text)", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 240, flexShrink: 0, borderRight: "1px solid var(--color-divider)", background: "var(--color-surface)", padding: "20px 0" }}>
          <div style={{ padding: "0 20px", fontSize: "11px", fontWeight: 700, letterSpacing: ".05em", color: "var(--color-neutral-600)" }}>অ্যাডমিন প্যানেল</div>
          <AdminNav />
        </aside>

        {/* Main Content */}
        <main className="animate-ph-in" style={{ flex: 1, minWidth: 0, padding: "32px 40px" }}>
          {children}
        </main>
      </div>
      <Toast />
    </div>
  );
}
