import type { Metadata, Viewport } from "next";
import { Anek_Bangla } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { SearchProvider } from "@/components/providers/SearchProvider";
import { ChatWidget } from "@/components/shared/ChatWidget";

// Anek Bangla covers both the Bengali and Latin text on every page. It used to
// be paired with Plus Jakarta Sans and Hind Siliguri as fallbacks, but no glyph
// ever rendered with them while their ~210 KB of preloaded files held up the
// first paint on mobile, so they were dropped.
const anekBangla = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-anek",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Premium Hatbazar — প্রিমিয়াম সাবস্ক্রিপশন স্টোর",
    template: "%s — Premium Hatbazar",
  },
  description:
    "ChatGPT, Netflix, Canva, Adobe — ১০০% আসল সাবস্ক্রিপশন। সাধারণত ১০–৩০ মিনিটে ডেলিভারি, পুরো টার্মে রিপ্লেসমেন্ট ওয়ারেন্টি। বিকাশ, নগদ, রকেট।",
  applicationName: "Premium Hatbazar",
  // Short name under the icon on an iPhone home screen; capable: false keeps it
  // opening in Safari rather than as a standalone app.
  appleWebApp: { title: "Premium Hatbazar", capable: false },
  keywords: [
    "Premium Hatbazar",
    "premium subscription",
    "ChatGPT Plus Bangladesh",
    "Netflix Premium BD",
    "Canva Pro BD",
  ],
  openGraph: {
    title: "Premium Hatbazar — প্রিমিয়াম সাবস্ক্রিপশন স্টোর",
    description:
      "ChatGPT, Netflix, Canva, Adobe — ১০০% আসল সাবস্ক্রিপশন, সাধারণত ১০–৩০ মিনিটে ডেলিভারি।",
    siteName: "Premium Hatbazar",
    locale: "bn_BD",
    type: "website",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#161826",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={anekBangla.variable}
    >
      <body>
        <LenisProvider>
          <SearchProvider>
            <CartProvider>
              {children}
              <ChatWidget />
            </CartProvider>
          </SearchProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
