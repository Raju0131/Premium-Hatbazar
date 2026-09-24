"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { calcPrice, getTerm } from "@/lib/price";

/**
 * The cart lives in localStorage rather than a server cookie: reading a cookie
 * in the root layout forced every page to render per request, while keeping
 * it client-side lets the storefront pages be prerendered and served from the
 * CDN (and skips a server round trip on every page view).
 */
const STORAGE_KEY = "ph-cart";

/* ── State ── */
interface CartState {
  items: CartItem[];
  isOpen: boolean;
  toast: string | null;
}

/* ── Actions ── */
type CartAction =
  | { type: "ADD"; product: Product; termMonths: number }
  | { type: "SET_QTY"; key: string; qty: number }
  | { type: "REMOVE"; key: string }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOAST"; msg: string | null }
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "CLEAR" };

function makeKey(productId: string, termMonths: number) {
  return `${productId}:${termMonths}`;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const p = action.product;
      const term = getTerm(action.termMonths);
      const price = calcPrice(p.monthlyPrice, term.months, term.discountPercent, p.isOneTime);
      // One-time top-ups ignore the subscription term (matches the mockup's `p.one ? 0 : term`).
      const months = p.isOneTime ? 0 : term.months;
      const key = makeKey(p.id, months);
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + 1, unitPrice: price } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            key,
            productId: p.id,
            nameBn: p.nameBn,
            mark: p.mark,
            termMonths: months,
            qty: 1,
            unitPrice: price,
            baseMonthly: p.monthlyPrice,
            isOneTime: p.isOneTime,
            unitLabel: p.unitLabel,
          },
        ],
      };
    }
    case "SET_QTY": {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.key !== action.key) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === action.key ? { ...i, qty: action.qty } : i
        ),
      };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.key !== action.key) };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "TOAST":
      return { ...state, toast: action.msg };
    case "HYDRATE":
      return { ...state, items: action.items };
    case "CLEAR":
      return { ...state, items: [], toast: null };
    default:
      return state;
  }
}

/* ── Context ── */
interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  toast: string | null;
  cartCount: number;
  subtotal: number;
  total: number;
  addToCart: (product: Product, termMonths: number) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  openCart: () => void;
  closeCart: () => void;
  showToast: (msg: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    isOpen: false,
    toast: null,
  });

  /* Restore the saved cart on first mount, then persist every change. */
  const restored = useRef(false);
  useEffect(() => {
    if (!restored.current) {
      restored.current = true;
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        if (Array.isArray(saved) && saved.length > 0) dispatch({ type: "HYDRATE", items: saved });
      } catch {
        /* storage unavailable or corrupt: start with an empty cart */
      }
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items]);

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "TOAST", msg: null }), 3500);
    return () => clearTimeout(t);
  }, [state.toast]);

  const cartCount = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const total = subtotal; // discount already baked into unitPrice

  const addToCart = useCallback(
    (product: Product, termMonths: number) => {
      dispatch({ type: "ADD", product, termMonths });
      dispatch({ type: "TOAST", msg: `${product.nameBn} কার্টে যোগ হয়েছে` });
    },
    []
  );

  const setQty = useCallback((key: string, qty: number) => {
    dispatch({ type: "SET_QTY", key, qty });
  }, []);

  const removeItem = useCallback((key: string) => {
    dispatch({ type: "REMOVE", key });
  }, []);

  const openCart = useCallback(() => dispatch({ type: "OPEN" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const showToast = useCallback((msg: string) => dispatch({ type: "TOAST", msg }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        toast: state.toast,
        cartCount,
        subtotal,
        total,
        addToCart,
        setQty,
        removeItem,
        openCart,
        closeCart,
        showToast,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
