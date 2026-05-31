"use client";

import { useState } from "react";

export function ShareLinkButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Копирай линка към събитието", url);
    }
  }

  return (
    <button
      className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-bold text-neutral-800 transition hover:bg-neutral-50"
      type="button"
      onClick={handleShare}
    >
      {copied ? "Линкът е копиран" : "Сподели линк"}
    </button>
  );
}