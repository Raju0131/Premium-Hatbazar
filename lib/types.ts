/** Product type matching the data from the design mockup */

export interface ProductSpec {
  k: string;
  v: string;
}

export interface Product {
  id: string;
  slug: string;
  nameBn: string;
  category: string;
  mark: string;
  monthlyPrice: number;
  isOneTime: boolean;
  unitLabel: string;
  badge: string;
  deliveryEta: string;
  stock: number;
  aboutBn: string;
  specs: ProductSpec[];
  includes: string[];
  metaBn: string;
  wasPrice?: number;
  imageUrl?: string | null;
}

export interface CartItem {
  key: string;
  productId: string;
  nameBn: string;
  mark: string;
  termMonths: number;
  qty: number;
  unitPrice: number;
  baseMonthly: number;
  isOneTime: boolean;
  unitLabel: string;
}

export interface OrderData {
  customerName: string;
  phone: string;
  email: string;
  paymentMethod: string;
  txnId: string;
  items: {
    productId: string;
    termMonths: number;
    qty: number;
    unitPrice: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
}

export interface OrderStatus {
  id: string;
  customerName: string;
  status: string;
  createdAt: string;
  items: {
    nameBn: string;
    mark: string;
    termMonths: number;
    qty: number;
    unitPrice: number;
  }[];
}

export const CATEGORIES = ["All", "AI Tools", "Streaming", "Design", "Gaming", "Gift cards"] as const;

export const CATEGORY_BN: Record<string, string> = {
  All: "সব",
  "AI Tools": "এআই টুলস",
  Streaming: "স্ট্রিমিং",
  Design: "ডিজাইন",
  Gaming: "গেমিং",
  "Gift cards": "গিফট কার্ড",
};

export const PAYMENT_METHODS = [
  { key: "bkash", name: "বিকাশ", sub: "সেন্ড মানি", num: "০১৩১৫ ১৫২০০৫" },
  { key: "nagad", name: "নগদ", sub: "সেন্ড মানি", num: "০১৩১৫ ১৫২০০৫" },
  { key: "rocket", name: "রকেট", sub: "সেন্ড মানি", num: "০১৩১৫১৫২০০৫১" },
] as const;

// Store WhatsApp (the footer's +880 1315 152005) in the digits-only form wa.me links use.
export const WHATSAPP_NUMBER = "8801315152005";

/** Opens a WhatsApp chat with the store, with `text` ready to send. */
export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const FAQ_DATA = [
  {
    q: "অ্যাকাউন্ট কি শেয়ার্ড?",
    a: "না। ChatGPT, Claude, Grammarly প্রাইভেট অ্যাকাউন্টে যায়। Netflix-এ আপনার নিজের আলাদা প্রোফাইল থাকে, পিন দিয়ে লক করা। Canva, YouTube, Spotify আপনার নিজের মেইলেই ইনভাইট হয়।",
  },
  {
    q: "কত সময় লাগে?",
    a: "সাধারণত ১০–৩০ মিনিট। Adobe-র মতো কিছু প্রোডাক্টে ২ ঘণ্টা পর্যন্ত লাগতে পারে। রাত ২টায় অর্ডার করলেও ডেলিভারি হয়।",
  },
  {
    q: "ওয়ারেন্টি মানে কী?",
    a: "যত মাসের টার্ম কিনেছেন, পুরো সময় ওয়ারান্টি। অ্যাকাউন্টে সমস্যা হলে WhatsApp-এ অর্ডার আইডি দিন — রিপ্লেসমেন্ট পাবেন, কোনো তর্ক ছাড়াই।",
  },
  {
    q: "পেমেন্ট কিভাবে করব?",
    a: "bKash, Nagad বা Rocket-এ সেন্ড মানি করুন। চেকআউটে ট্রানজেকশন আইডি বসিয়ে দিন — ব্যাস।",
  },
  {
    q: "রিফান্ড পাওয়া যাবে?",
    a: "ডেলিভারি দিতে না পারলে ১০০% রিফান্ড। ডেলিভারির পর রিপ্লেসমেন্ট দেওয়া হয় — টার্মের পুরো সময় জুড়ে।",
  },
];
