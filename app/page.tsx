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
  ['🏦', 'Bank Connection'],
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
    text: 'Combines PAYE, self-employment profit, CIS suffered, student loans, NIC and payments on account.',
    metric: '£19,174',
    label: 'Estimated payable',
  },
  {
    icon: '💷',
    title: 'VAT Return',
    text: 'Box 1–9 presentation, quarterly period logic, flat-rate handling and export-ready HMRC-style summaries.',
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
    title: 'Bank Connection',
    text: 'Securely connect a UK bank account and keep transactions flowing into your records, with full visibility and control over the connection.',
    metric: '1',
    label: 'Connected account demo',
  },
  {
    icon: '🔐',
    title: 'Secure & Private',
    text: 'Local-first product design, privacy notices, export warnings and clear control over business records.',
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
          <span className="mt-2 block bg-gradient-to-r from-[#5BA3FF] via-blue-400 to-[#1D4ED8] bg-clip-text text-transparent">Taxes Made Easy.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-300">
          The all-in-one bookkeeping platform for UK sole traders, CIS workers, drivers and self-employed professionals. Designed around the way real small businesses record income, organise receipts, create invoices, review VAT and prepare for tax.
        </p>

        <div className="mt-7 grid gap-3 text-slate-300">
          {heroBullets.map((item) => (
            <div key={item} className="flex items-center gap-3 text-base">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-[#5BA3FF]/50 text-[#5BA3FF] shadow-[0_0_18px_rgba(29,78,216,.25)]">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link href="/app" className="rounded-2xl bg-gradient-to-r from-[#5BA3FF] via-[#2F80FF] to-[#1D4ED8] px-8 py-5 font-black shadow-[0_0_55px_rgba(99,102,241,.45)] transition hover:-translate-y-1 hover:shadow-[0_0_80px_rgba(99,102,241,.58)]">
            Start Free Trial →
          </Link>
          <Link href="/features" className="rounded-2xl border border-[#5BA3FF]/35 bg-white/5 px-8 py-5 font-black backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
            Explore Features
          </Link>
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-slate-400">
          <span className="text-[#5BA3FF]">◉</span> 14-day free trial. No card required. Cancel anytime before renewal.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
          <span className="flex items-center gap-2"><span className="text-[#5BA3FF]">✓</span> Built specifically for CIS & VAT</span>
          <span className="flex items-center gap-2"><span className="text-[#5BA3FF]">✓</span> Local-first — your data stays on your device</span>
          <span className="flex items-center gap-2"><span className="text-[#5BA3FF]">✓</span> Direct HMRC MTD filing</span>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,128,255,.16),rgba(29,78,216,.18)_45%,transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-16 left-1/2 h-[4px] w-[78%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#5BA3FF] to-[#2F80FF] shadow-[0_0_35px_rgba(47,128,255,.8)]" />
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
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">Built for how UK sole traders actually work.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Everything important is visible quickly: tax year profit, VAT threshold, invoices, receipts, reports, CIS, Self Assessment, bank connection and privacy controls. The product feels like a personal finance cockpit for self-employed work.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-5">
            {[
              ['CIS', 'Built in, not bolted on'],
              ['MTD', 'Direct HMRC filing'],
              ['£0', 'Genuinely free tier, forever'],
              ['100%', 'Local-first — your data, your device'],
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
            <Card key={card.title} className="group transition hover:-translate-y-1 hover:border-[#5BA3FF]/30 hover:shadow-[0_30px_110px_rgba(47,128,255,.10)]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#5BA3FF]/15 to-[#1D4ED8]/15 text-2xl shadow-[0_0_26px_rgba(29,78,216,.18)]">{card.icon}</div>
              <h3 className="mt-5 text-xl font-black text-white">{card.title}</h3>
              <p className="mt-3 min-h-[84px] text-sm leading-7 text-slate-300">{card.text}</p>
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/22 p-4">
                <div className="text-2xl font-black text-[#5BA3FF]">{card.metric}</div>
                <div className="mt-1 text-xs text-slate-400">{card.label}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div>
          <Pill>Why this app, not a generic one</Pill>
          <h2 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Built around real UK sole trader work — not adapted from enterprise software.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Most bookkeeping apps are built for accountants or big businesses first, then simplified. Tax Sole Trader started the other way round: from the actual weekly workflow of a UK sole trader, subcontractor or driver.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["CIS built in from day one", "Not a bolt-on afterthought — 20%/30%/gross deduction handling is core to how the app works, not a checkbox added later."],
            ["Genuinely free tier, forever", "Real day-to-day invoicing, transactions, receipts and mileage — no account, no card, no trial clock running."],
            ["Your data stays yours", "Local-first by default. Cloud sync is something you switch on, not something forced on you from day one."],
            ["Direct HMRC filing, not just exports", "Submit VAT returns and quarterly Income Tax updates straight to HMRC — not just a PDF you re-type elsewhere."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="rounded-[2.6rem] border border-[#5BA3FF]/20 bg-gradient-to-br from-[#2F80FF]/10 via-blue-700/10 to-[#1D4ED8]/15 p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Pill>Custom workspace</Pill>
            <h2 className="mt-5 text-4xl font-black md:text-6xl">Arrange the app around the way you work.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              The Home screen is not just a menu. It is a personalised business workspace. Users can arrange tools around their daily routine — invoices first, receipts first, VAT first, or bank connection first.
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
                <h3 className="mt-4 text-xl font-black text-[#5BA3FF]">{f.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{f.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="text-center">
        <Pill>Bank connection</Pill>
        <h2 className="mt-5 text-4xl font-black md:text-6xl">Connect your bank in three simple steps.</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Tax Sole Trader connects securely to your UK bank account so your records stay current — without you typing every transaction by hand.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            n: '01',
            icon: '🏦',
            title: 'Connect your bank',
            text: 'Choose your UK bank and securely sign in through your bank\u2019s own login screen. Tax Sole Trader never sees or stores your banking password.',
          },
          {
            n: '02',
            icon: '🔍',
            title: 'See transactions safely',
            text: 'Once connected, transactions start flowing into your records automatically. Everything stays visible and easy to review before it counts toward your books.',
          },
          {
            n: '03',
            icon: '✅',
            title: 'Stay in control',
            text: 'Check the connection status anytime, review what has come in, and disconnect your bank in one tap whenever you want — no questions asked.',
          },
        ].map((step) => (
          <Card key={step.n} className="relative overflow-hidden">
            <div className="absolute right-5 top-5 text-6xl font-black text-white/5">{step.n}</div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#5BA3FF]/15 to-[#1D4ED8]/15 text-2xl shadow-[0_0_26px_rgba(29,78,216,.18)]">{step.icon}</div>
            <h3 className="mt-5 text-xl font-black text-white">{step.title}</h3>
            <p className="mt-3 leading-7 text-slate-300">{step.text}</p>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">
        Bank connection uses secure Open Banking technology. Your login details are entered directly with your bank, never with Tax Sole Trader.
      </p>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="text-center">
        <Pill>Free forever, upgrade when you&apos;re ready</Pill>
        <h2 className="mt-5 text-4xl font-black md:text-6xl">Pay for what you use. Nothing else.</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">Start with a genuinely free plan for everyday bookkeeping. Upgrade to Premium — with a 14-day free trial, no card required — for full breakdowns, exports and HMRC filing.</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map(p => (
          <Card key={p.key} className={p.highlight ? 'relative border-[#2F80FF]/50 bg-[#2F80FF]/10 shadow-[0_0_70px_rgba(29,78,216,.16)]' : 'relative'}>
            {p.badge && <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-[#5BA3FF] to-[#2F80FF] px-3 py-1 text-xs font-black">{p.badge}</div>}
            <h3 className="text-2xl font-black">{p.name}</h3>
            <div className="mt-5 flex flex-wrap items-baseline gap-2">
              {p.strikePrice && <span className="text-lg font-bold text-slate-500 line-through">{p.strikePrice}</span>}
              <span className="text-5xl font-black">{p.price}</span>
              <span className="text-base font-semibold text-slate-400">{p.priceSuffix}</span>
            </div>
            {p.afterNote && <p className="mt-1 text-sm font-semibold text-[#5BA3FF]">{p.afterNote}</p>}
            <p className="mt-1 text-sm text-slate-400">{p.note}</p>
            <p className="mt-5 leading-7 text-slate-300">{p.description}</p>
            <ul className="mt-7 grid gap-3 text-sm text-slate-300">{p.features.slice(0,8).map(f => <li key={f}>✓ {f}</li>)}</ul>
            <Link href="/app" className="mt-8 block rounded-2xl border border-[#5BA3FF]/35 bg-white/5 px-6 py-4 text-center font-black transition hover:bg-white/10">{p.cta}</Link>
          </Card>
        ))}
      </div>
    </Section>

    <Section className="xl:max-w-[1540px]">
      <div className="rounded-[2.6rem] border border-white/10 bg-gradient-to-br from-[#2F80FF]/10 via-blue-700/10 to-[#1D4ED8]/15 p-8 text-center md:p-12">
        <Pill>Launch ready</Pill>
        <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black md:text-6xl">One QR code. Every device. Always the right destination.</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Use <strong>taxsoletrader.com/app</strong> on flyers, keychains, business cards and stickers. When Android and iOS apps are live, the QR code stays the same and the page directs customers to the right store.
        </p>
        <Link href="/app" className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-[#5BA3FF] via-[#2F80FF] to-[#1D4ED8] px-8 py-5 font-black shadow-[0_0_55px_rgba(99,102,241,.45)]">Open app page</Link>
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


    <Section className="xl:max-w-[1540px]">
      <div className="rounded-[2.6rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
        <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl border border-[#5BA3FF]/25 bg-gradient-to-br from-[#5BA3FF]/15 to-[#1D4ED8]/15 text-4xl">🛠️</div>
          <div>
            <Pill>Why this exists</Pill>
            <p className="mt-5 text-xl leading-9 text-slate-300">
              Tax Sole Trader is built by a solo, independent developer — not a big accounting software company. It started from watching real UK sole traders, subcontractors and drivers struggle with software built for someone else&apos;s business. Every feature exists because a real workflow needed it, not because a roadmap said so.
            </p>
          </div>
        </div>
      </div>
    </Section>
    <CTA/>
  </Shell>
}
