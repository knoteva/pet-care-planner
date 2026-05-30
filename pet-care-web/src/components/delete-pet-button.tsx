"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePetButton({ petId }: { petId: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/pets/${petId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="inline-flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="cursor-pointer rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
        >
          {loading ? "..." : "Потвърди"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold"
        >
          Откажи
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
    >
      Изтрий
    </button>
  );
}
