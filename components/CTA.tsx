import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="overflow-hidden rounded-[34px] border border-blue-300/30 bg-gradient-to-br from-blue-500/20 via-[#071120] to-purple-700/20 p-8 shadow-[0_0_80px_rgba(47,128,255,.12)] md:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.32em] text-blue-200">
              Professional launch ready
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-[-1.5px] md:text-5xl">
              A serious fintech-style presence for Tax Sole Trader™
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Website, domain, support page and universal app QR link — ready for Google Play,
              App Store and future subscription plans.
            </p>
          </div>
          <Link
            href="/support"
            className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-8 py-5 text-center text-sm font-black shadow-[0_0_50px_rgba(47,128,255,.30)] transition hover:scale-[1.02]"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
