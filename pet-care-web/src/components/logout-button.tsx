"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { classNames } from "./ui-primitives";

export function LogoutButton({
  variant = "button",
}: {
  variant?: "button" | "link";
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      className={classNames(
        variant === "link"
          ? "text-xs font-semibold text-neutral-600 hover:text-emerald-700 disabled:opacity-60"
          : "rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60",
      )}
      disabled={isSubmitting}
      onClick={handleLogout}
    >
      {isSubmitting ? "Излизане..." : "Изход"}
    </button>
  );
}