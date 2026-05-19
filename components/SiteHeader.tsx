"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/support", label: "Support" },
  { href: "/app", label: "Download" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#010309]/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-header.png"
            alt="Tax Sole Trader"
            width={420}
            height={110}
            priority
            className="h-auto w-[230px] sm:w-[300px] lg:w-[360px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-300 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-cyan-300">
              {item.label}
            </Link>
          ))}
          <Link
            href="/app"
            className="rounded-2xl border border-cyan-300/40 bg-white/[0.04] px-5 py-3 text-white shadow-[0_0_30px_rgba(47,128,255,.18)] transition hover:bg-white/[0.08]"
          >
            Get App
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-xl md:hidden"
          aria-label="Open menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <div className="mx-5 mb-4 rounded-3xl border border-white/10 bg-[#071120] p-4 md:hidden">
          <div className="grid gap-3 text-sm font-bold text-slate-200">
            {nav.map((item) => (
              <Link
                onClick={() => setOpen(false)}
                key={item.href}
                href={item.href}
                className="rounded-2xl bg-white/[0.04] px-4 py-3"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
