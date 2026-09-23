import { SaleStrip } from "@/components/layout/SaleStrip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartPanel } from "@/components/layout/CartPanel";
import { Toast } from "@/components/shared/Toast";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBand } from "@/components/home/TrustBand";
import { Catalogue } from "@/components/home/Catalogue";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Reviews } from "@/components/home/Reviews";
import { FAQ } from "@/components/home/FAQ";
import { CTABand } from "@/components/home/CTABand";
import { getProducts } from "@/lib/queries";

// Reads products (incl. image URLs) from the DB per request — never prerender at build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        fontFamily: "var(--font-body)",
        color: "var(--color-text)",
      }}
    >
      <SaleStrip />
      <Header />

      <main id="top">
        <HeroSection products={products} />
        <TrustBand />
        <Catalogue products={products} />
        <HowItWorks />
        <Reviews />
        <FAQ />
        <CTABand />
      </main>

      <Footer />
      <CartPanel />
      <Toast />
    </div>
  );
}
