"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {}
      }}
      className="num shrink-0 border border-line px-3 py-1.5 text-xs uppercase tracking-widest text-muted transition hover:border-acento hover:text-acento"
    >
      {copied ? "Copiado ✓" : label}
    </button>
  );
}
