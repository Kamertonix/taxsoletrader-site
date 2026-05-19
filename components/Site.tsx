"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const nav = [
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["App", "/app"],
  ["Support", "/support"],
];

export const shots = {
  home: "/screens/home.jpg",
  dashboard: "/screens/dashboard.jpg",
  selfAssessment: "/screens/self-assessment.jpg",
  vatReturn: "/screens/vat-return.jpg",
  receipts: "/screens/receipts.jpg",
  reports: "/screens/mtd-reports.jpg",
  security: "/screens/security.jpg",
};

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030812]/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-header.png" alt="Tax Sole Trader" width={320} height={90} priority className="h-auto w-[225px] sm:w-[275px]" />
        </Link>
        <nav className="hidden items-center gap-9 text-sm font-bold text-slate-300 md:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">{label}</Link>
          ))}
        </nav>
        <Link href="/app" className="hidden rounded-2xl bg-gradient-to-r from-[#2f86ff] via-[#7557ff] to-[#f04dff] px-5 py-3 text-sm font-black shadow-[0_0_40px_rgba(117,87,255,.36)] transition hover:scale-[1.03] md:inline-flex">Start Free Trial</Link>
        <Link href="/app" className="rounded-xl border border-white/15 px-4 py-2 text-sm font-black md:hidden">App</Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#030812]">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-12 md:grid-cols-[1.35fr_.7fr_.7fr_.7fr] lg:px-8">
        <div>
          <Image src="/logo-header.png" alt="Tax Sole Trader" width={300} height={80} className="h-auto w-[235px]" />
          <p className="mt-5 max-w-md leading-7 text-slate-400">Premium bookkeeping for UK sole traders, CIS workers, drivers and self-employed professionals. Built around real UK workflows, not generic accounting clutter.</p>
        </div>
        <FooterCol title="Product" items={[["Features","/features"],["Pricing","/pricing"],["Download app","/app"],["Support","/support"]]} />
        <FooterCol title="Workflows" items={[["VAT Return","/vat-return"],["Self Assessment","/self-assessment"],["Receipts","/receipts"],["Security","/security"]]} />
        <FooterCol title="Legal" items={[["Privacy Policy","/privacy"],["Terms","/terms"],["Contact","/support"]]} />
      </div>
      <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-3 border-t border-white/10 px-5 py-5 text-sm text-slate-500 md:flex-row lg:px-8">
        <span>© 2026 Tax Sole Trader™. All rights reserved.</span>
        <span>UK bookkeeping • VAT • CIS • Self Assessment</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[][] }) {
  return <div><h3 className="font-black text-white">{title}</h3><div className="mt-4 grid gap-3 text-sm text-slate-400">{items.map(([a, b]) => <Link key={b} href={b} className="hover:text-white">{a}</Link>)}</div></div>;
}

export function Shell({ children }: { children: React.ReactNode }) {
  return <main className="relative min-h-screen overflow-hidden bg-[#02050d] text-white"><Bg /><Header />{children}<Footer /></main>;
}

export function Bg() {
  return <>
    <div className="fixed inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(30,231,255,.20),transparent_30%),radial-gradient(circle_at_85%_8%,rgba(160,74,255,.23),transparent_31%),radial-gradient(circle_at_48%_80%,rgba(47,134,255,.16),transparent_42%),linear-gradient(180deg,#02050d,#041022_55%,#02050d)]" />
    <div className="fixed inset-0 bg-grid" />
    <div className="fixed left-[-12%] top-[8%] h-[620px] w-[620px] rounded-full bg-cyan-500/20 blur-[160px]" />
    <div className="fixed right-[-10%] top-[10%] h-[640px] w-[640px] rounded-full bg-purple-600/22 blur-[180px]" />
    <div className="fixed inset-x-0 top-[46%] h-[2px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent blur-sm" />
  </>;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-200 shadow-[0_0_28px_rgba(30,231,255,.12)]">{children}</div>;
}

export function SectionTitle({ badge, title, subtitle }: { badge?: string; title: string; subtitle?: string }) {
  return <div className="mx-auto max-w-4xl text-center">{badge && <Badge>{badge}</Badge>}<h2 className="mt-5 text-4xl font-black tracking-[-1.5px] md:text-6xl">{title}</h2>{subtitle && <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">{subtitle}</p>}</div>;
}

const homeButtons = [
  ["📷", "Scan / Expense"], ["💳", "Transactions"], ["📄", "Invoices"], ["📈", "Dashboard"],
  ["📊", "MTD"], ["🧾", "Receipts"], ["🧾", "Self Assessment"], ["💷", "VAT Return"],
  ["🤖", "AI Help"], ["📅", "HMRC Deadlines"], ["🏦", "Bank Import"], ["🔐", "Security"],
];

export function AppHomePhone({ className = "" }: { className?: string }) {
  const [pressed, setPressed] = useState<string | null>(null);
  return (
    <PhoneFrame className={className} noScroll>
      <div className="app-home-screen">
        <div className="app-status"><span>21:46</span><span>✈︎ 100</span></div>
        <div className="app-header">
          <img src="/favicon.png" alt="TS" />
          <div><div className="hello">Good evening, John</div><div className="brand-line">Tax <span>Sole</span> Trader</div><div className="subline">UK bookkeeping • VAT • CIS</div></div>
          <div className="bell">🔔</div>
        </div>
        <div className="app-grid">
          {homeButtons.map(([icon, label]) => (
            <button
              key={label}
              type="button"
              onPointerDown={() => setPressed(label)}
              onPointerUp={() => setPressed(null)}
              onPointerLeave={() => setPressed(null)}
              className={`app-tile ${pressed === label ? "pressed" : ""}`}
            >
              <span className="tile-icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className="bottom-nav"><b>🏠<span>Home</span></b><b>📈<span>Dashboard</span></b><b>📊<span>Reports</span></b><b>👨‍💼<span>My Profile</span></b><b>⚙️<span>Settings</span></b></div>
      </div>
    </PhoneFrame>
  );
}

export function PhoneFrame({ children, className = "", noScroll = false }: { children: React.ReactNode; className?: string; noScroll?: boolean }) {
  return <div className={`real-phone ${className}`}>
    <div className="phone-metal" />
    <div className="phone-notch" />
    <div className="phone-side right" />
    <div className="phone-side left" />
    <div className={`phone-screen ${noScroll ? "no-scrollbar" : ""}`}>{children}</div>
    <div className="phone-shine" />
  </div>;
}

export function ScrollPhone({ src, title, caption, delay = "0s" }: { src: string; title?: string; caption?: string; delay?: string }) {
  return <div className="scroll-phone-card">
    <PhoneFrame>
      <div className="auto-scroll-track" style={{ animationDelay: delay }}><img src={src} alt={title || "Tax Sole Trader screen"} /></div>
    </PhoneFrame>
    {title && <div className="mt-5"><div className="text-xs font-black uppercase tracking-[.32em] text-blue-200/60">Scroll inside phone</div><h3 className="mt-3 text-xl font-black">{title}</h3>{caption && <p className="mt-2 leading-7 text-slate-400">{caption}</p>}</div>}
  </div>;
}

export function Hero() {
  return (
    <section className="relative z-10 mx-auto grid max-w-[1500px] items-center gap-12 px-5 pb-20 pt-14 lg:grid-cols-[.92fr_1.08fr] lg:px-8 lg:pt-24">
      <div>
        <Badge>Built for UK sole traders</Badge>
        <h1 className="mt-7 text-5xl font-black leading-[.95] tracking-[-2.5px] md:text-7xl lg:text-[82px]">Accounting Made Simple. <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">Taxes Made Easy.</span></h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">A premium bookkeeping platform for UK sole traders, CIS workers, drivers and self-employed professionals. Manage receipts, invoices, VAT, CIS, Self Assessment and reports from one beautiful mobile workspace.</p>
        <div className="mt-8 flex flex-wrap gap-4"><Link className="btn-primary" href="/app">Start first month free</Link><Link className="btn-secondary" href="/features">Explore features</Link></div>
        <p className="mt-4 text-sm text-slate-500">First month free for new users. Paid subscription required after trial.</p>
        <div className="mt-9 grid grid-cols-2 gap-3 text-sm text-slate-200 sm:grid-cols-3">
          {['Bookkeeping','Invoicing','Receipts & Expenses','VAT & CIS','Self Assessment','MTD-ready Reports'].map(x => <div key={x} className="glass rounded-2xl px-4 py-3">✓ {x}</div>)}
        </div>
      </div>
      <div className="relative flex justify-center lg:justify-end">
        <div className="absolute bottom-8 h-[160px] w-[520px] rounded-[50%] bg-gradient-to-r from-cyan-400/30 via-blue-500/10 to-purple-500/35 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_58%,rgba(47,134,255,.24),transparent_46%)]" />
        <AppHomePhone className="animate-float" />
      </div>
    </section>
  );
}

export const featureGroups = [
  { title: "Custom Home Workspace", icon: "✨", text: "The home screen can be arranged around how the user works. Put Scan / Expense, Invoices, Dashboard, MTD, Receipts, VAT Return, Self Assessment, Bank Import or Security where they are easiest to reach." },
  { title: "Business Dashboard", icon: "📈", text: "Real-time profit, income, expenses, estimated tax, VAT threshold, quarter period and AI insight. Switch between Month, Quarter and Tax Year without losing clarity." },
  { title: "VAT Return Engine", icon: "📊", text: "Box 1–9 VAT summaries, Standard VAT, Flat Rate VAT direction, quarterly periods and export actions. Built for bookkeeping review and MTD-style presentation." },
  { title: "Self Assessment", icon: "🧾", text: "Combines self-employment profit with PAYE income, tax already paid, NIC, CIS suffered, student loans and payments on account so users see what may be payable before filing." },
  { title: "Receipt Hub", icon: "🧱", text: "Capture, categorise and filter receipts by calendar month, CIS month, quarter and tax year. Export accountant-ready summaries with VAT estimates." },
  { title: "Reports & Accountant Pack", icon: "📦", text: "Profit & loss, VAT/CIS summaries, monthly charts, full report text, PDF export, CSV export, saved exports and accountant share workflows." },
  { title: "Bank Import", icon: "🏦", text: "Import PDF bank statements, preview detected transactions, avoid duplicates and keep imported lines connected to their source statement." },
  { title: "Privacy & Protection", icon: "🔐", text: "Local-first direction, backup/export awareness, screen privacy mode, security guidance and anti-clone legal protection wording." },
];

export function FeatureGrid() {
  return <section id="features" className="relative z-10 mx-auto max-w-[1500px] px-5 py-20 lg:px-8"><SectionTitle badge="Product system" title="Everything important. Nothing messy." subtitle="Tax Sole Trader is designed around real weekly self-employed work — not generic accounting screens for large companies." /><div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{featureGroups.map(f => <div key={f.title} className="lux-card rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35"><div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl shadow-[0_0_32px_rgba(30,231,255,.10)]">{f.icon}</div><h3 className="mt-5 text-xl font-black">{f.title}</h3><p className="mt-3 leading-7 text-slate-400">{f.text}</p></div>)}</div></section>;
}

export function ScreensShowcase() {
  const items = [
    [shots.dashboard, "Business Dashboard", "Tax overview, VAT threshold and AI insight.", "0s"],
    [shots.selfAssessment, "Self Assessment", "PAYE, self-employment, CIS and payments on account.", "-2s"],
    [shots.vatReturn, "VAT Return", "Box 1–9 logic with export buttons and MTD-ready summary.", "-4s"],
    [shots.receipts, "Receipt Hub", "Search, filter, categories, VAT estimate and accountant export.", "-6s"],
  ];
  return <section className="relative z-10 mx-auto max-w-[1500px] px-5 py-20 lg:px-8"><SectionTitle badge="Real app screens" title="Scrollable phone previews, like the real app." subtitle="Screens sit inside realistic phone frames. The previews auto-scroll smoothly one after another, and pause when hovered." /><div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">{items.map(([src, title, caption, delay]) => <ScrollPhone key={title} src={src} title={title} caption={caption} delay={delay} />)}</div></section>;
}

export function CustomWorkspace() {
  return <section className="relative z-10 mx-auto max-w-[1320px] px-5 py-20 lg:px-8"><div className="grid items-center gap-10 rounded-[3rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-600/15 p-8 shadow-[0_40px_120px_rgba(0,0,0,.38)] lg:grid-cols-[.95fr_1.05fr] lg:p-12"><div><Badge>Custom workspace</Badge><h2 className="mt-6 text-4xl font-black tracking-[-1.5px] md:text-6xl">Arrange the app around the way you work.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">The home screen is designed to feel like a personal finance cockpit for self-employed work. Users can prioritise the tools they use most — scanning expenses, creating invoices, checking tax, reviewing VAT, exporting reports or importing bank statements.</p><Link href="/features" className="btn-primary mt-8">See all workflows</Link></div><div className="flex justify-center"><AppHomePhone /></div></div></section>;
}

export function PricingCards() {
  const plans = [
    { name: "Trial", price: "£0", note: "First month only", desc: "Try the full workflow before subscription starts.", items: ["Business dashboard", "Invoices and receipts", "VAT/CIS preview", "Basic exports", "Cancel anytime"] },
    { name: "Premium", price: "£7.99", note: "per month", desc: "For everyday UK sole traders who need complete records.", popular: true, items: ["Everything in trial", "VAT & CIS tools", "Branded invoice PDFs", "Receipt Hub", "Reports and exports", "Self Assessment dashboard"] },
    { name: "PRO", price: "£14.99", note: "per month", desc: "For growing businesses that want deeper insight and accountant packs.", items: ["Everything in Premium", "Mileage direction", "Recurring invoice direction", "Accountant export pack", "Advanced analytics", "Priority support"] },
  ];
  return <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-5 py-20 lg:px-8"><SectionTitle badge="Pricing" title="First month free. Then choose the plan that fits your business." subtitle="No permanent free plan. Tax Sole Trader is a serious paid business tool with a first-month free trial for new users." /><div className="mt-12 grid gap-6 lg:grid-cols-3">{plans.map(p => <div key={p.name} className={`rounded-[2rem] p-7 ${p.popular ? 'border border-purple-300/50 bg-purple-500/10 shadow-[0_0_80px_rgba(155,77,255,.18)]' : 'lux-card'}`}>{p.popular && <div className="mb-5 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-4 py-1 text-xs font-black">MOST POPULAR</div>}<h3 className="text-2xl font-black">{p.name}</h3><div className="mt-5 flex items-end gap-2"><span className="text-5xl font-black">{p.price}</span><span className="pb-2 text-slate-400">{p.note}</span></div><p className="mt-4 leading-7 text-slate-400">{p.desc}</p><div className="mt-7 grid gap-3 text-sm text-slate-300">{p.items.map(i => <div key={i}>✓ {i}</div>)}</div><Link href="/app" className={p.popular ? 'btn-primary mt-8 w-full' : 'btn-secondary mt-8 w-full'}>{p.name === 'Trial' ? 'Start free trial' : `Choose ${p.name}`}</Link></div>)}</div></section>;
}

export function AppCTA() {
  return <section className="relative z-10 mx-auto max-w-[1320px] px-5 py-20 lg:px-8"><div className="rounded-[3rem] border border-purple-300/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-600/15 p-10 text-center shadow-[0_40px_120px_rgba(0,0,0,.38)]"><Badge>Universal QR destination</Badge><h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black tracking-[-1.5px] md:text-6xl">One QR code. Every device. Always the right destination.</h2><p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">Use taxsoletrader.com/app on flyers, keychains, business cards and stickers. When Android and iOS apps are live, the QR code stays the same and the page directs customers to the right store.</p><Link href="/app" className="btn-primary mt-8">Open app page</Link></div></section>;
}

export function WorkflowPage({ badge, title, subtitle, screen, points, reverse = false }: { badge: string; title: string; subtitle: string; screen: string; points: string[]; reverse?: boolean }) {
  return <Shell><section className="relative z-10 mx-auto max-w-[1400px] px-5 py-20 lg:px-8"><SectionTitle badge={badge} title={title} subtitle={subtitle} /><div className={`mt-16 grid items-center gap-12 lg:grid-cols-2 ${reverse ? 'lg:[&>div:first-child]:order-2' : ''}`}><div className="flex justify-center"><ScrollPhone src={screen} delay="-2s" /></div><div className="grid gap-5">{points.map(p => <div key={p} className="glass rounded-3xl px-6 py-5 text-lg font-black">✓ {p}</div>)}</div></div></section></Shell>;
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { h: string; p: string }[] }) {
  return <Shell><section className="relative z-10 mx-auto max-w-4xl px-5 py-20 lg:px-8"><Badge>Legal</Badge><h1 className="mt-6 text-5xl font-black tracking-[-2px] md:text-7xl">{title}</h1><p className="mt-4 text-slate-400">Last updated: {updated}</p><div className="mt-10 grid gap-5">{sections.map((s, i) => <div key={s.h} className="lux-card rounded-[2rem] p-7"><h2 className="text-2xl font-black">{i + 1}. {s.h}</h2><p className="mt-4 leading-8 text-slate-300">{s.p}</p></div>)}</div></section></Shell>;
}
