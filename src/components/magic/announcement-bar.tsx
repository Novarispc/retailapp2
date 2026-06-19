"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";

// Dismissible top promo bar. Stays hidden for the session once closed.
export function AnnouncementBar() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("promo-season-dismissed")) setShow(false);
  }, []);

  if (!show) return null;

  return (
    <div className="relative z-50 bg-[var(--accent)] text-[var(--on-accent)]">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2 text-center">
        <Zap className="hidden h-4 w-4 shrink-0 fill-current sm:block" />
        <span className="font-display text-xs font-bold uppercase tracking-[0.14em] sm:text-sm">
          New season drop — free shipping over ₹3,000
        </span>
        <Link
          href="/catalog"
          className="font-display shrink-0 rounded-full bg-[var(--on-accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--accent)] transition-transform hover:scale-105"
        >
          Shop now
        </Link>
      </div>
      <button
        onClick={() => {
          setShow(false);
          sessionStorage.setItem("promo-season-dismissed", "1");
        }}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-[var(--on-accent)]/15"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
