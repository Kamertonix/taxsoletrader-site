"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/privacy", label: "Privacy" },
  { href: "/support", label: "Support" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#071120]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-[92px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-header.png"
            alt="Tax Sole Trader"
            width={420}
            height={110}
            priority
            className="h-auto w-[245px] sm:w-[310px] lg:w-[360px]"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-[#B8C1D1] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/support"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
          >
            Contact
          </Link>
          <Link
            href="/pricing"
            className="rounded-2xl bg-gradient-to-r from-[#5BA3FF] to-[#2F80FF] px-5 py-3 text-sm font-black text-white shadow-[0_0_34px_rgba(47,128,255,.32)] transition hover:scale-[1.02]"
          >
            Get Early Access
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 lg:hidden"
          aria-label="Open menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="mx-4 mb-4 rounded-3xl border border-white/10 bg-[#0B172A] p-5 lg:hidden">
          <div className="grid gap-4 text-sm font-bold text-[#B8C1D1]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link
              href="/pricing"
              className="mt-2 rounded-2xl bg-gradient-to-r from-[#5BA3FF] to-[#2F80FF] px-5 py-3 text-center font-black text-white"
            >
              Get Early Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
