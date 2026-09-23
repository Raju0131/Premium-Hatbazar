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
  { key: "binance", name: "বাইন্যান্স", sub: "USDT · TRC20", num: "TQm4xP…9vLk" },
] as const;

export const FAQ_DATA = [
  {
    q: "অ্যাকাউন্ট কি শেয়ার্ড?",
    a: "না। ChatGPT, Claude, Grammarly প্রাইভেট অ্যাকাউন্টে যায়। Netflix-এ আপনার নিজের আলাদা প্রোফাইল থাকে, পিন দিয়ে লক করা। Canva, YouTube, Spotify আপনার নিজের মেইলেই ইনভাইট হয়।",
  },
  {
    q: "কত সময় লাগে?",
    a: "বেশিরভাগ অর্ডার ১০ মিনিটের মধ্যে, গড় ৮ মিনিট। Adobe-র মতো কিছু প্রোডাক্টে ২ ঘণ্টা পর্যন্ত লাগতে পারে। রাত ২টায় অর্ডার করলেও ডেলিভারি হয়।",
  },
  {
    q: "ওয়ারেন্টি মানে কী?",
    a: "যত মাসের টার্ম কিনেছেন, পুরো সময় ওয়ারান্টি। অ্যাকাউন্টে সমস্যা হলে WhatsApp-এ অর্ডার আইডি দিন — মিনিটের মধ্যে রিপ্লেসমেন্ট, কোনো তর্ক ছাড়াই।",
  },
  {
    q: "পেমেন্ট কিভাবে করব?",
    a: "bKash, Nagad, Rocket-এ সেন্ড মানি করুন, নয়তো Binance-এ USDT। চেকআউটে ট্রানজেকশন আইডি বসিয়ে দিন — ব্যাস।",
  },
  {
    q: "রিফান্ড পাওয়া যাবে?",
    a: "ডেলিভারি দিতে না পারলে ১০০% রিফান্ড, সাথে সাথে। ডেলিভারির পর রিপ্লেসমেন্ট দেওয়া হয় — টার্মের পুরো সময় জুড়ে।",
  },
];

export const REVIEWS_DATA = [
  {
    initials: "SA",
    name: "সাদমান আহমেদ",
    meta: "ঢাকা · ChatGPT Plus",
    body: "রাত ১টায় অর্ডার দিয়েছিলাম, ৬ মিনিটে অ্যাকাউন্ট পেয়ে গেছি। প্রাইভেট মেইল, পাসওয়ার্ড নিজেই চেঞ্জ করেছি। ৪ মাস চলছে, কোনো ঝামেলা নেই।",
  },
  {
    initials: "NJ",
    name: "নুসরাত জাহান",
    meta: "চট্টগ্রাম · Canva Pro",
    body: "নিজের অ্যাকাউন্টেই Pro হয়ে গেছে, পুরনো ডিজাইন সব ঠিক আছে। দাম অন্য জায়গার চেয়ে কম, আর রিপ্লাই সাথে সাথে পাই।",
  },
  {
    initials: "TH",
    name: "তানভীর হোসেন",
    meta: "সিলেট · Netflix Premium",
    body: "একবার প্রোফাইল সমস্যা করেছিল, WhatsApp-এ বলার ৯ মিনিটে নতুন দিয়ে দিয়েছে। এই জিনিসটার জন্যই বারবার এখান থেকেই কিনি।",
  },
];

export const ACTIVITY_DATA = [
  { name: "সাদমান", product: "ChatGPT Plus", time: "২ মিনিট আগে" },
  { name: "নুসরাত", product: "Canva Pro", time: "৫ মিনিট আগে" },
  { name: "তানভীর", product: "Netflix Premium", time: "এইমাত্র" },
  { name: "রিফাত", product: "YouTube Premium", time: "৮ মিনিট আগে" },
];
