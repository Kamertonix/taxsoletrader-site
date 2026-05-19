"use client";

import { motion } from "framer-motion";
import { Camera, FileText, ReceiptText, ShieldCheck } from "lucide-react";

const rows = [
  ["Invoice INV-1056", "John Builders Ltd", "+£1,250", "text-[#16C784]"],
  ["Screwfix Materials", "Materials", "-£89.98", "text-white"],
  ["Fuel Receipt", "Business travel", "-£60.00", "text-white"],
];

export default function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, rotate: 5 }}
      animate={{ opacity: 1, scale: 1, rotate: 3 }}
      transition={{ duration: 0.9 }}
      className="phone-float relative mx-auto"
    >
      <div className="absolute inset-0 rounded-[72px] bg-gradient-to-r from-[#2F80FF]/35 via-[#5BA3FF]/20 to-[#16C784]/14 blur-3xl" />
      <div className="relative w-[330px] rounded-[54px] border border-white/10 bg-gradient-to-b from-[#111827] to-black p-3 shadow-[0_55px_150px_rgba(0,0,0,.75)] sm:w-[390px]">
        <div className="rounded-[44px] border border-white/10 bg-[#071120] p-5">
          <div className="mx-auto mb-5 h-6 w-32 rounded-b-2xl bg-black" />

          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#B8C1D1]">Business Dashboard</div>
              <div className="text-lg font-black">Tax Year 2026–2027</div>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#2F80FF]/15 text-[#5BA3FF]">
              <ShieldCheck size={22} />
            </div>
          </div>

          <div className="rounded-3xl border border-[#2F80FF]/30 bg-gradient-to-br from-[#12284A] to-[#0B172A] p-5 shadow-[0_0_45px_rgba(47,128,255,.15)]">
            <div className="text-sm text-[#B8C1D1]">Profit This Year</div>
            <div className="mt-2 text-4xl font-black">£18,735</div>
            <div className="mt-2 text-sm font-bold text-[#16C784]">+12.5% vs last year</div>
            <div className="relative mt-6 h-20 overflow-hidden rounded-3xl bg-black/20">
              <div className="absolute bottom-5 left-4 h-12 w-[86%] rounded-[50%] border-b-4 border-[#5BA3FF] opacity-80 shadow-[0_18px_40px_rgba(91,163,255,.32)]" />
              <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ["Income", "£28,450", "bg-[#12284A]"],
              ["Expenses", "£9,714", "bg-[#2D1B08]"],
              ["VAT Due", "£2,350", "bg-[#1D1633]"],
              ["CIS", "£740", "bg-[#10271D]"],
            ].map(([label, value, bg]) => (
              <div key={label} className={`rounded-2xl border border-white/10 ${bg} p-4`}>
                <div className="text-xs text-[#B8C1D1]">{label}</div>
                <div className="mt-1 font-black">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between text-sm font-black">
              <span>Recent Activity</span>
              <span className="text-[#5BA3FF]">See all</span>
            </div>
            {rows.map(([title, sub, value, cls]) => (
              <div key={title} className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                <div>
                  <div className="text-sm font-bold">{title}</div>
                  <div className="text-xs text-[#7C8799]">{sub}</div>
                </div>
                <div className={`text-sm font-black ${cls}`}>{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              [FileText, "Invoice"],
              [ReceiptText, "Receipt"],
              [Camera, "Scan"],
            ].map(([Icon, label]: any) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-center">
                <Icon className="mx-auto text-[#5BA3FF]" size={21} />
                <div className="mt-2 text-[11px] font-black">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
