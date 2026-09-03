"use client";

import { useMemo, useState } from "react";

const initialTiles: { id: string; icon: string; title: string; ring?: string }[] = [
  { id: "scan", icon: "📷", title: "Scan / Expenses" },
  { id: "mileage", icon: "🚗", title: "Mileage Tracker" },
  { id: "invoices", icon: "📄", title: "Invoices Overdue", ring: "#ff4d4f" },
  { id: "dashboard", icon: "📈", title: "Dashboard" },
  { id: "mtd", icon: "📊", title: "MTD Report" },
  { id: "transactions", icon: "💳", title: "Transactions Needs review", ring: "#ffce3d" },
  { id: "sa", icon: "📝", title: "Self Assessment" },
  { id: "accountant", icon: "👤", title: "Invite Accountant" },
  { id: "vat", icon: "🧾", title: "VAT Return" },
  { id: "boltimport", icon: "📥", title: "Bolt Import" },
  { id: "deadlines", icon: "📅", title: "HMRC Deadlines" },
  { id: "bankimport", icon: "📤", title: "Bank Import" },
  { id: "organizer", icon: "📁", title: "Organizer" },
  { id: "hmrcconnection", icon: "💻", title: "HMRC Connection" },
];

export default function InteractiveHomePhone() {
  const [tiles, setTiles] = useState(initialTiles);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);

  const orderHint = useMemo(() => tiles.slice(0, 4).map((tile) => tile.title).join(" • "), [tiles]);

  function moveTile(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setTiles((current) => {
      const from = current.findIndex((tile) => tile.id === dragId);
      const to = current.findIndex((tile) => tile.id === targetId);
      if (from < 0 || to < 0) return current;
      const copy = [...current];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }

  return (
    <div className="phone-real relative mx-auto w-[350px] max-w-full md:w-[390px]">
      <div className="absolute -inset-8 rounded-[4.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(47,128,255,.26),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(29,78,216,.28),transparent_40%)] blur-3xl" />
      <div className="relative rounded-[3.7rem] border border-white/18 bg-gradient-to-b from-slate-700/50 via-[#121826] to-black p-[10px] shadow-[0_70px_180px_rgba(0,0,0,.78),inset_0_0_0_1px_rgba(255,255,255,.08)]">
        <div className="absolute left-1/2 top-[10px] z-30 h-[24px] w-[132px] -translate-x-1/2 rounded-b-[1.2rem] bg-black shadow-[0_12px_35px_rgba(0,0,0,.75)]" />
        <div className="absolute right-[-4px] top-[150px] h-20 w-[5px] rounded-r-full bg-slate-600/70" />
        <div className="absolute left-[-4px] top-[115px] h-14 w-[5px] rounded-l-full bg-slate-600/60" />
        <div className="absolute left-[-4px] top-[185px] h-20 w-[5px] rounded-l-full bg-slate-600/50" />

        <div className="relative h-[735px] overflow-hidden rounded-[3rem] bg-[#06101d] shadow-[inset_0_0_50px_rgba(59,130,246,.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(20,184,166,.14),transparent_26%),radial-gradient(circle_at_90%_15%,rgba(59,130,246,.16),transparent_30%)]" />
          <div className="phone-scroll relative h-full overflow-y-auto px-6 pb-24 pt-10">
            <div className="flex items-center justify-between text-[11px] font-black text-white">
              <span>21:46</span>
              <span>✈ 100</span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <img src="/app-icon.png" alt="" className="h-[66px] w-[66px] object-contain" />
              <div>
                <p className="text-sm text-slate-400">Good evening, John</p>
                <h3 className="text-[22px] font-black leading-tight">
                  Tax <span className="text-blue-400">Sole</span> Trader
                </h3>
                <p className="mt-1 text-xs text-slate-400">UK bookkeeping • VAT • CIS</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {tiles.map((tile) => (
                <button
                  key={tile.id}
                  draggable
                  type="button"
                  onDragStart={() => setDragId(tile.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => moveTile(tile.id)}
                  onDragEnd={() => setDragId(null)}
                  onPointerDown={() => setPressed(tile.id)}
                  onPointerUp={() => setPressed(null)}
                  onPointerLeave={() => setPressed(null)}
                  onClick={(event) => {
                    event.preventDefault();
                    setPressed(tile.id);
                    window.setTimeout(() => setPressed(null), 140);
                  }}
                  className={`group aspect-[360/234] flex flex-col items-center justify-center gap-2 rounded-[23px] border text-center shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_10px_28px_rgba(0,0,0,.22)] transition duration-200 hover:-translate-y-0.5 active:scale-[.96] ${
                    tile.ring
                      ? "tile-alert-pulse border-2"
                      : "border-white/10 hover:border-[#5BA3FF]/35 hover:shadow-[0_0_24px_rgba(47,128,255,.13)]"
                  } bg-gradient-to-b from-[#183250] to-[#101827] ${
                    pressed === tile.id ? "scale-[.96] border-[#5BA3FF]/60 bg-gradient-to-b from-[#21466f] to-[#121b2a]" : ""
                  } ${dragId === tile.id ? "opacity-50" : ""}`}
                  style={tile.ring ? { borderColor: tile.ring, color: tile.ring } : undefined}
                  aria-label={`${tile.title}. Drag to reorder.`}
                >
                  <div className="text-base transition group-hover:scale-110">{tile.icon}</div>
                  <div className="px-2 text-[11px] font-black leading-snug text-white">{tile.title}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[#5BA3FF]/20 bg-white/[0.04] p-3 text-[11px] leading-5 text-slate-300">
              Drag cards to reorder. Tap cards for press effect. Demo only: buttons do not navigate.
              <br />
              <span className="text-[#5BA3FF]">Current top tools:</span> {orderHint}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050912] via-[#050912]/90 to-transparent" />
          <div className="absolute inset-x-4 bottom-3 rounded-2xl border border-white/12 bg-[#050912]/90 px-3 py-2 backdrop-blur-xl">
            <div className="grid grid-cols-5 gap-1 text-center text-[9px] font-black text-slate-300">
              <span className="text-blue-400">🏠<br />Home</span>
              <span>📈<br />Dashboard</span>
              <span>📊<br />Reports</span>
              <span>👨‍💼<br />Profile</span>
              <span>⚙️<br />Settings</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#5BA3FF]/70">Interactive home screen demo</p>
    </div>
  );
}
