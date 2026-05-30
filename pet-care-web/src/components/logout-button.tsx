"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
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
      className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isSubmitting}
      onClick={handleLogout}
    >
      {isSubmitting ? "Излизане..." : "Изход"}
    </button>
  );
}