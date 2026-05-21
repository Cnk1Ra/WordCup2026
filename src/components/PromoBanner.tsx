"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const KEY = "spacefut-promo-dismissed-v1";

export function PromoBanner({
  message,
  link,
  version,
}: {
  message: string;
  link: string | null;
  version: string;
}) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    setDismissed(stored === version);
  }, [version]);

  if (dismissed) return null;

  const content = (
    <p className="text-xs sm:text-sm font-bold tracking-tight">{message}</p>
  );

  return (
    <div className="bg-foreground text-white">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-3">
        {link ? (
          <Link href={link} className="flex-1 text-center sm:text-left hover:opacity-80">
            {content}
          </Link>
        ) : (
          <div className="flex-1 text-center sm:text-left">{content}</div>
        )}
        <button
          onClick={() => {
            localStorage.setItem(KEY, version);
            setDismissed(true);
          }}
          aria-label="Fechar"
          className="shrink-0 p-1 rounded-full hover:bg-white/10 transition"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
