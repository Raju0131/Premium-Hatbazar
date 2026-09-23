/** Price calculation matching the mockup's logic */

import { toBn } from "./bn";

export interface TermOption {
  months: number;
  label: string;
  discountPercent: number;
}

export const TERMS: TermOption[] = [
  { months: 1, label: "১ মাস", discountPercent: 0 },
  { months: 3, label: "৩ মাস", discountPercent: 10 },
  { months: 12, label: "১২ মাস", discountPercent: 22 },
];

/**
 * Calculate total price for a product given the term.
 * One-time products ignore the term and return monthlyPrice directly.
 * Subscription products: round(monthlyPrice * months * (1 - discount/100) / 5) * 5
 */
export function calcPrice(
  monthlyPrice: number,
  termMonths: number,
  discountPercent: number,
  isOneTime: boolean
): number {
  if (isOneTime) return monthlyPrice;
  return Math.round((monthlyPrice * termMonths * (1 - discountPercent / 100)) / 5) * 5;
}

/** Get the term option by months */
export function getTerm(months: number): TermOption {
  return TERMS.find((t) => t.months === months) ?? TERMS[0];
}

/**
 * Label shown for a cart/checkout line. One-time top-ups are not subscriptions,
 * so they read "এক বার …" (matching the mockup) instead of a month term.
 */
export function displayTermLabel(item: {
  isOneTime: boolean;
  termMonths: number;
  unitLabel: string;
}): string {
  if (item.isOneTime) {
    const unit = item.unitLabel.replace("/ ", "").trim();
    return unit ? `এক বার ${unit}` : "এক বার";
  }
  const t = TERMS.find((term) => term.months === item.termMonths);
  return t?.label ?? `${toBn(item.termMonths)} মাস`;
}
