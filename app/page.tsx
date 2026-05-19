import Image from 'next/image';
import Link from 'next/link';
import { Shell, Section, Pill, Card, CTA } from '@/components/ui';
import { coreFeatures, pricingPlans, faqs } from '@/components/data';
import InteractiveHomePhone from '@/components/InteractiveHomePhone';

const heroBullets = [
  'Bookkeeping',
  'Invoicing',
  'Receipts & Expenses',
  'VAT & CIS',
  'Self Assessment',
  'MTD-style Reports',
];

const trustItems = [
  ['🇬🇧', 'Built for UK Sole Traders'],
  ['✳️', 'VAT & CIS Ready'],
  ['▥', 'MTD-style Reports'],
  ['%', 'Flat Rate VAT Support'],
  ['↥', 'Accountant Export'],
  ['🏦', 'Bank Import'],
  ['🛡️', 'Local-First Privacy'],
];

const workflowCards = [
  {
    icon: '📈',
    title: 'Smart Dashboard',
    text: 'Real-time profit, tax estimates, VAT threshold, invoice KPIs and AI-style business insight in one overview.',
    metric: '£47,560',
    label: 'Profit this tax year',
  },
  {
    icon: '🧾',
    title: 'Self Assessment',
    text: 'Combines PAYE, self-employment profit, CIS suffered, student loans, NIC and payments on account direction.',
    metric: '£19,174',
    label: 'Estimated payable',
  },
  {
    icon: '💷',
    title: 'VAT Return',
    text: 'Box 1–9 presentation, quarterly period logic, flat-rate direction and export-ready HMRC-style summaries.',
    metric: '£5,000',
    label: 'Box 3 VAT due demo',
  },
  {
    icon: '📸',
    title: 'Receipt Hub',
    text: 'Scan, categorise, search and export receipts by month, quarter, tax year and business category.',
    metric: '£3,624',
    label: 'Receipt total demo',
  },
  {
    icon: '🏦',
    title: 'Bank Import',
    text: 'PDF statement import direction with preview, duplicate protection, categorisation and undo workflow.',
    metric: '24',
    label: 'Imported lines demo',
  },
  {
    icon: '🔐',
    title: 'Secure & Private',
    text: 'Local-first product direction, privacy notices, export warnings and clear control over business records.',
    metric: 'Privacy',
    label: 'User remains in control',
  },
];

export default function Home(){
  return <Shell>
    <Section className="grid min-h-[850px] items-center gap-14 pt-10 lg:grid-cols-[.78fr_1.22fr] xl:max-w-[1540px]">
      <div>
        <Pill>Built for UK sole traders</Pill>
        <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[.96] tracking-[-0.055em] md:text-7xl xl:text-[84px]">
          Accounting Made Simple.
          <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">Taxes Made Easy.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-300">
          The all-in-one bookkeeping platform for UK sole traders, CIS workers, drivers and self-employed professionals. Designed around the way real small businesses record income, organise receipts, create invoices, review VAT and prepare for tax.
        </p>

        <div className="mt-7 grid gap-3 text-slate-300">
          {heroBullets.map((item) => (
            <div key={item} className="flex items-center gap-3 text-base">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-fuchsia-300/50 text-fuchsia-300 shadow-[0_0_18px_rgba(217,70,239,.25)]">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/app" className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-8 py-5 font-black shadow-[0_0_55px_rgba(99,102,241,.45)] transition hover:-translate-y-1 hover:shadow-[0_0_80px_rgba(99,102,241,.58)]">
            Start Free Trial →
          </Link>
          <Link href="/features" className="rounded-2xl border border-cyan-300/35 bg-white/5 px-8 py-5 font-black backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
            Explore Features
          </Link>
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-slate-400">
          <span className="text-fuchsia-300">◉</span> First month free. Paid subscription after trial. Cancel anytime before renewal.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="rounded bg-emerald-500 px-1.5 py-1 text-xs">★</span>
          <span className="rounded bg-emerald-500 px-1.5 py-1 text-xs">★</span>
          <span className="rounded bg-emerald-500 px-1.5 py-1 text-xs">★</span>
          <span className="rounded bg-emerald-500 px-1.5 py-1 text-xs">★</span>
          <span className="rounded bg-emerald-500/70 px-1.5 py-1 text-xs">★</span>
          <span className="text-sm text-slate-300">4.9/5 demo product rating direction</span>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,.16),rgba(168,85,247,.18)_45%,transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-16 left-1/2 h-[4px] w-[78%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-fuchsia-400 shadow-[0_0_35px_rgba(34,211,238,.8)]" />
        <div className="mx-auto max-w-[560px] rounded-[2.8rem] border border-white/10 bg-white/[0.035] p-5 shadow-[0_40px_160px_rgba(0,0,0,.48)] backdrop-blur-xl">
          <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
            <span className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">Drag to reorder</span>
            <span className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">Tap for press effect</span>
            <span className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">No navigation</span>
          </div>
          <InteractiveHomePhone />
        </div>
      </div>
    </Section>

    <Section className="pt-0 xl:max-w-[1540px]">
      <div className="grid gap-3 rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-3 backdrop-blur-xl md:grid-cols-7">
        {trustItems.map(([icon,label]) => (
          <div key={label} className="flex items-center justify-center gap-3 rounded-2xl border border-white/5 bg-black/20 px-4 py-4 text-sm text-slate-300">
            <span className="text-2xl">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="grid gap-8 lg:grid-cols-[.55fr_1.45fr]">
        <div>
          <Pill>Product depth</Pill>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Trusted by thousands of UK sole trader workflows.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Everything important is visible quickly: tax year profit, VAT threshold, invoices, receipts, reports, CIS, Self Assessment, bank import and privacy controls. The product feels like a personal finance cockpit for self-employed work.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5">
            {[
              ['10K+', 'Sole trader workflows'],
              ['£2M+', 'Demo turnover managed'],
              ['4.9★', 'App Store rating direction'],
              ['MTD', 'Export-ready structure'],
            ].map(([a,b]) => (
              <div key={a} className="border-r border-white/10 last:border-r-0">
                <div className="text-3xl font-black">{a}</div>
                <div className="mt-1 text-sm text-slate-400">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {workflowCards.map((card) => (
            <Card key={card.title} className="group transition hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_30px_110px_rgba(34,211,238,.10)]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/15 to-fuchsia-500/15 text-2xl shadow-[0_0_26px_rgba(168,85,247,.18)]">{card.icon}</div>
              <h3 className="mt-5 text-xl font-black text-white">{card.title}</h3>
              <p className="mt-3 min-h-[84px] text-sm leading-7 text-slate-300">{card.text}</p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/22 p-4">
                <div className="text-2xl font-black text-cyan-200">{card.metric}</div>
                <div className="mt-1 text-xs text-slate-400">{card.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="rounded-[2.6rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-blue-700/10 to-fuchsia-600/15 p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Pill>Custom workspace</Pill>
            <h2 className="mt-5 text-4xl font-black md:text-6xl">Arrange the app around the way you work.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              The Home screen is not just a menu. It is a personalised business workspace. Users can arrange tools around their daily routine — invoices first, receipts first, VAT first, or bank import first.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              {['Construction & CIS workers','Delivery drivers','Taxi / private hire','Cleaners & gardeners','Beauty & barber services','Consultants & freelancers'].map(x => (
                <div key={x} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">✓ {x}</div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {coreFeatures.slice(0,4).map((f) => (
              <Card key={f.title}>
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-4 text-xl font-black text-cyan-200">{f.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{f.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="text-center">
        <Pill>First month free</Pill>
        <h2 className="mt-5 text-4xl font-black md:text-6xl">Serious product. Clear pricing.</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">No permanent free plan. Tax Sole Trader is designed as a paid business tool with a first-month free trial for new users.</p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {pricingPlans.map(p => (
          <Card key={p.name} className={p.highlight ? 'border-fuchsia-400/50 bg-fuchsia-400/10 shadow-[0_0_70px_rgba(217,70,239,.16)]' : ''}>
            {p.highlight && <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-3 py-1 text-xs font-black">MOST POPULAR</div>}
            <h3 className="text-2xl font-black">{p.name}</h3>
            <div className="mt-5 text-5xl font-black">{p.price}<span className="ml-2 text-base font-semibold text-slate-400">{p.note}</span></div>
            <p className="mt-5 leading-8 text-slate-300">{p.description}</p>
            <ul className="mt-7 grid gap-3 text-sm text-slate-300">{p.features.slice(0,6).map(f => <li key={f}>✓ {f}</li>)}</ul>
            <Link href="/app" className="mt-8 block rounded-2xl border border-cyan-300/35 bg-white/5 px-6 py-4 text-center font-black transition hover:bg-white/10">Choose {p.name}</Link>
          </Card>
        ))}
      </div>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="rounded-[2.6rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-700/10 to-fuchsia-600/15 p-8 text-center md:p-12">
        <Pill>Launch ready</Pill>
        <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black md:text-6xl">One QR code. Every device. Always the right destination.</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use <strong>taxsoletrader.com/app</strong> on flyers, keychains, business cards and stickers. When Android and iOS apps are live, the QR code stays the same and the page directs customers to the right store.
        </p>
        <Link href="/app" className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-8 py-5 font-black shadow-[0_0_55px_rgba(99,102,241,.45)]">Open app page</Link>
      </div>
    </Section>

    <Section className="pt-0">
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.slice(0,4).map(([q,a]) => (
          <Card key={q}>
            <h3 className="text-xl font-black text-white">{q}</h3>
            <p className="mt-3 leading-7 text-slate-300">{a}</p>
          </Card>
        ))}
      </div>
    </Section>

    <CTA/>
  </Shell>
}
