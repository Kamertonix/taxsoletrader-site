"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010309] text-white">

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(0,212,255,.20),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(168,85,247,.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(0,119,255,.14),transparent_34%)]" />

      <div className="absolute inset-0 opacity-60">
        <div className="absolute left-[-10%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500 blur-[140px]" />
        <div className="absolute right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-purple-600 blur-[160px]" />
      </div>

      {/* HEADER */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Image
  src="/logo-header.png"
  alt="TaxSoleTrader"
  width={260}
  height={90}
  className="h-auto w-[320px] md:w-[420px]"
/>

        <div className="hidden gap-8 text-sm font-semibold text-slate-300 md:flex">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-20 px-6 pb-24 pt-10 lg:grid-cols-2">

        {/* LEFT */}
        <div>
          <div className="mb-6 inline-flex items-center rounded-full border border-cyan-400/30 bg-white/5 px-4 py-2 text-sm font-bold tracking-wide text-cyan-300 backdrop-blur">
            🇬🇧 BUILT FOR UK SOLE TRADERS
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl font-black leading-[0.95] tracking-[-3px] md:text-8xl"
          >
            Accounting
            <br />
            Made Simple.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Taxes Made Easy.
            </span>
          </motion.h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
            Premium bookkeeping for UK sole traders, CIS workers,
            drivers and self-employed professionals.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-8 py-4 text-sm font-black shadow-[0_0_40px_rgba(0,212,255,.35)] transition hover:scale-105">
              Get Early Access
            </button>

            <button className="rounded-2xl border border-cyan-400/40 bg-white/5 px-8 py-4 text-sm font-black backdrop-blur transition hover:bg-white/10">
              View Features
            </button>
          </div>

          {/* FEATURES */}
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-slate-200">
            {[
              "CIS Ready",
              "VAT & Flat Rate",
              "Receipt Scanner",
              "Tax Estimates",
              "Professional Invoices",
              "Reverse Charge",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur"
              >
                <div className="h-5 w-5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* PHONE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: 4 }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto"
        >
          <div className="absolute inset-0 rounded-[60px] bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-purple-600/30 blur-3xl" />

          <div className="relative w-[360px] rounded-[48px] border border-white/10 bg-gradient-to-b from-slate-900 to-black p-3 shadow-[0_40px_120px_rgba(0,0,0,.7)]">

            <div className="rounded-[40px] border border-white/10 bg-[#08111f] p-6">

              <div className="mx-auto mb-6 h-6 w-32 rounded-b-2xl bg-black" />

              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-blue-500/20 to-transparent p-5">
                <div className="text-sm text-slate-400">
                  Profit This Year
                </div>

                <div className="mt-2 text-4xl font-black">
                  £18,735
                </div>

                <div className="mt-2 text-sm text-green-400">
                  +12.5% vs last year
                </div>

                <div className="mt-6 h-16 rounded-full border-b-4 border-cyan-400 opacity-70" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Income", "£28,450"],
                  ["Expenses", "£9,714"],
                  ["VAT Due", "£2,350"],
                  ["Tax Est.", "£4,873"],
                ].map(([a, b]) => (
                  <div
                    key={a}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="text-xs text-slate-400">
                      {a}
                    </div>

                    <div className="mt-1 font-bold">
                      {b}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between text-sm font-bold">
                  <span>Recent Transactions</span>
                  <span className="text-cyan-300">See all</span>
                </div>

                {[
                  ["Invoice INV-1056", "+£1,250"],
                  ["Screwfix Materials", "-£89.98"],
                  ["Fuel Receipt", "-£60.00"],
                ].map(([a, b]) => (
                  <div
                    key={a}
                    className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <span className="text-sm text-slate-200">
                      {a}
                    </span>

                    <span className="text-sm font-bold">
                      {b}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-4xl font-light shadow-[0_0_40px_rgba(0,212,255,.4)]">
                +
              </div>

            </div>
          </div>
        </motion.div>

      </section>
    </main>
  );
}