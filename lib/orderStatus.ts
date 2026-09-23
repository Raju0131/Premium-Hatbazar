export const ORDER_STATUSES = ["PENDING", "VERIFIED", "DELIVERED", "CANCELLED"] as const;
export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_BN: Record<string, string> = {
  PENDING: "পেন্ডিং",
  VERIFIED: "ভেরিফাইড",
  DELIVERED: "ডেলিভারড",
  CANCELLED: "বাতিল",
};

export function orderStatusStyle(status: string): { bg: string; fg: string } {
  switch (status) {
    case "DELIVERED":
      return { bg: "var(--color-accent-500)", fg: "var(--color-bg)" };
    case "PENDING":
      return { bg: "var(--color-accent-900)", fg: "var(--color-accent-300)" };
    case "VERIFIED":
      return { bg: "var(--color-neutral-800)", fg: "var(--color-neutral-100)" };
    default:
      return { bg: "var(--color-neutral-900)", fg: "var(--color-neutral-500)" };
  }
}
