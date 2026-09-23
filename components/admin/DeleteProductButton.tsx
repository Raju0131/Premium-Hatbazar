"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const onDelete = () => {
    if (!window.confirm(`"${name}" — ডিলিট করবেন?`)) return;
    start(async () => {
      const res = await deleteProduct(id);
      if (!res.ok) window.alert(res.error ?? "ডিলিট করা যায়নি।");
      else router.refresh();
    });
  };

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      style={{
        padding: "5px 10px",
        border: "1px solid var(--color-neutral-800)",
        borderRadius: 7,
        background: "transparent",
        fontFamily: "inherit",
        fontSize: "12px",
        fontWeight: 600,
        color: "var(--color-neutral-400)",
        cursor: pending ? "not-allowed" : "pointer",
      }}
    >
      {pending ? "..." : "ডিলিট"}
    </button>
  );
}
