export default function PhoneMockup() {
  const stats = [
    ["Income", "£28,450"],
    ["Expenses", "£9,714"],
    ["VAT Due", "£2,350"],
    ["CIS", "£740"],
  ];

  const rows = [
    ["Invoice INV-1056", "John Builders Ltd", "+£1,250"],
    ["Screwfix Materials", "Materials", "-£89.98"],
    ["Fuel Receipt", "Business travel", "-£60.00"],
  ];

  return (
    <div className="relative mx-auto w-full max-w-[430px]">
      <div className="absolute inset-0 rounded-[70px] bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-purple-600/30 blur-3xl" />
      <div className="floaty relative rounded-[58px] border border-white/10 bg-gradient-to-br from-slate-700/40 via-black to-slate-950 p-4 shadow-[0_55px_150px_rgba(0,0,0,.78)]">
        <div className="rounded-[46px] border border-white/10 bg-[#071120] p-5">
          <div className="mx-auto mb-5 h-6 w-32 rounded-b-2xl bg-black/80" />

          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                Dashboard
              </div>
              <div className="mt-1 text-sm font-bold text-slate-300">Tax Year 2026–2027</div>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-blue-300/20 bg-blue-400/10 text-blue-300">
              ⟡
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-blue-500/25 to-transparent p-5">
            <div className="text-sm text-slate-400">Profit This Year</div>
            <div className="mt-2 text-4xl font-black">£18,735</div>
            <div className="mt-2 text-sm font-bold text-emerald-400">+12.5% vs last year</div>
            <div className="mt-6 h-14 rounded-full border-b-4 border-cyan-300 opacity-80 shadow-[0_20px_35px_rgba(34,211,238,.20)]" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {stats.map(([label, value], i) => (
              <div
                key={label}
                className={[
                  "rounded-2xl border border-white/10 p-4",
                  i === 0 ? "bg-blue-500/10" : "",
                  i === 1 ? "bg-orange-500/10" : "",
                  i === 2 ? "bg-purple-500/10" : "",
                  i === 3 ? "bg-emerald-500/10" : "",
                ].join(" ")}
              >
                <div className="text-xs text-slate-400">{label}</div>
                <div className="mt-1 font-black">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between text-sm font-black">
              <span>Recent Activity</span>
              <span className="text-cyan-300">See all</span>
            </div>

            {rows.map(([title, sub, value]) => (
              <div
                key={title}
                className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
              >
                <div>
                  <div className="text-sm font-bold text-slate-200">{title}</div>
                  <div className="text-xs text-slate-500">{sub}</div>
                </div>
                <div className={value.startsWith("+") ? "text-sm font-black text-emerald-400" : "text-sm font-black"}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {["Invoice", "Receipt", "Scan"].map((item) => (
              <div key={item} className="rounded-2xl border border-blue-300/20 bg-blue-500/10 px-3 py-3 text-center text-xs font-black text-blue-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
