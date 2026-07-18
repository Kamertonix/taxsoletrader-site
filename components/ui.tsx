import Image from 'next/image';
import Link from 'next/link';
import { navItems, supportEmail } from './data';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#030711]/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-header.png" alt="Tax Sole Trader" width={260} height={65} priority className="h-auto w-[210px] md:w-[260px]" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
          {navItems.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-white">{label}</Link>)}
        </nav>
        <Link href="/app" className="tst-press rounded-2xl bg-gradient-to-r from-[#5BA3FF] to-[#2F80FF] px-5 py-3 text-sm font-black shadow-[0_0_35px_rgba(47,128,255,.35)] transition hover:brightness-110">Start Free Trial</Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#02050c]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Image src="/logo-header.png" alt="Tax Sole Trader" width={240} height={60} className="h-auto w-[220px]" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">Premium bookkeeping for UK sole traders, CIS workers, drivers and self-employed professionals.</p>
          <p className="mt-4 text-sm text-slate-500">© 2026 Tax Sole Trader™. All rights reserved.</p>
        </div>
        <FootGroup title="Product" items={[["Features","/features"],["Pricing","/pricing"],["Download App","/app"],["Support","/support"]]} />
        <FootGroup title="Specialist tools" items={[["VAT Return","/vat-return"],["Self Assessment","/self-assessment"],["Receipts","/receipts"],["MTD Reports","/mtd-reports"],["Security","/security"]]} />
        <div>
          <h3 className="font-black text-white">Legal</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400"><Link href="/privacy">Privacy Policy</Link><Link href="/delete-account">Delete Account & Data</Link><Link href="/terms">Terms & Conditions</Link><a href={`mailto:${supportEmail}`}>{supportEmail}</a></div>
        </div>
      </div>
    </footer>
  );
}
function FootGroup({title,items}:{title:string;items:string[][]}){return <div><h3 className="font-black text-white">{title}</h3><div className="mt-4 grid gap-3 text-sm text-slate-400">{items.map(([l,h])=><Link key={h} href={h}>{l}</Link>)}</div></div>}

export function Shell({children}:{children:React.ReactNode}){return <main className="min-h-screen overflow-hidden bg-[#02050c] text-white"><Background/><Header/>{children}<Footer/></main>}
export function Background(){return <>
  <div className="fixed inset-0 z-0 bg-[#020612]"/>
  <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_8%_8%,rgba(47,128,255,.20),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(29,78,216,.18),transparent_33%),radial-gradient(circle_at_58%_56%,rgba(91,163,255,.14),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(47,128,255,.10),transparent_36%)]"/>
  <div className="fixed inset-0 z-0 opacity-[.18] [background-image:linear-gradient(rgba(148,163,184,.24)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.24)_1px,transparent_1px)] [background-size:72px_72px]"/>
  <div className="fixed inset-0 z-0 opacity-70 [background:linear-gradient(115deg,transparent_30%,rgba(47,128,255,.12)_42%,rgba(29,78,216,.14)_52%,transparent_68%)]"/>
  <div className="fixed -bottom-32 left-1/2 z-0 h-64 w-[75vw] -translate-x-1/2 rounded-full bg-[#2F80FF]/10 blur-3xl"/>
</>}
export function Section({children,className=''}:{children:React.ReactNode;className?:string}){return <section className={`relative z-10 mx-auto max-w-7xl px-5 py-20 lg:px-8 ${className}`}>{children}</section>}
export function Pill({children}:{children:React.ReactNode}){return <div className="inline-flex items-center rounded-full border border-[#5BA3FF]/25 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#5BA3FF] shadow-[inset_0_0_25px_rgba(47,128,255,.08)] backdrop-blur">{children}</div>}
export function GradientTitle({children}:{children:React.ReactNode}){return <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.96] tracking-[-0.05em] md:text-7xl lg:text-[92px]">{children}</h1>}
export function Card({children,className=''}:{children:React.ReactNode;className?:string}){return <div className={`rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.035] p-6 shadow-[0_30px_90px_rgba(0,0,0,.28)] backdrop-blur-xl ${className}`}>{children}</div>}
export function CTA(){return <Section><div className="rounded-[2.2rem] border border-[#5BA3FF]/30 bg-gradient-to-br from-[#2F80FF]/25 via-[#1D4ED8]/15 to-[#5BA3FF]/20 p-8 md:p-12"><div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center"><div><Pill>Launch ready</Pill><h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">A serious fintech-style presence for Tax Sole Trader™.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Website, app landing page, support, privacy, terms and product pages — ready to connect with Google Play, App Store and future subscription plans.</p></div><Link href="/app" className="tst-press rounded-2xl bg-gradient-to-r from-[#5BA3FF] to-[#2F80FF] px-8 py-5 text-center font-black shadow-[0_0_55px_rgba(47,128,255,.45)] transition hover:brightness-110">Open /app QR page</Link></div></div></Section>}

export function PhoneMock({
  src='/screens/dashboard-year.jpg',
  alt='Tax Sole Trader app screenshot',
  className='',
  viewportClassName='',
  rotate=true,
}:{src?:string; alt?:string; className?:string; viewportClassName?:string; rotate?:boolean}){
  return (
    <div className={`relative mx-auto w-[286px] sm:w-[310px] md:w-[338px] ${className}`}>
      <div className="absolute -inset-8 rounded-[4rem] bg-[radial-gradient(circle,rgba(47,128,255,.24),rgba(29,78,216,.14)_42%,rgba(91,163,255,.18)_62%,transparent_74%)] blur-3xl" />
      <div
        className={`phone-real relative rounded-[3.35rem] border border-white/18 bg-[linear-gradient(145deg,#4b5563_0%,#111827_10%,#02040a_48%,#202938_100%)] p-[9px] shadow-[0_65px_180px_rgba(0,0,0,.72),inset_0_0_0_1px_rgba(255,255,255,.06)] ${rotate ? 'rotate-[2deg]' : ''}`}
      >
        <div className="pointer-events-none absolute -right-[5px] top-[142px] h-20 w-[5px] rounded-r-full bg-gradient-to-b from-slate-600 to-slate-900" />
        <div className="pointer-events-none absolute -left-[4px] top-[118px] h-10 w-[4px] rounded-l-full bg-gradient-to-b from-slate-500 to-slate-900" />
        <div className="pointer-events-none absolute -left-[4px] top-[174px] h-16 w-[4px] rounded-l-full bg-gradient-to-b from-slate-500 to-slate-900" />

        <div className="relative overflow-hidden rounded-[2.85rem] border border-black/80 bg-black p-[3px] shadow-[inset_0_0_34px_rgba(255,255,255,.08)]">
          <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-[28px] w-[118px] -translate-x-1/2 rounded-b-[1.15rem] bg-black shadow-[0_10px_28px_rgba(0,0,0,.85)]" />
          <div className="pointer-events-none absolute left-1/2 top-[8px] z-40 h-[6px] w-[38px] -translate-x-1/2 rounded-full bg-slate-900" />
          <div className="pointer-events-none absolute left-1/2 top-[8px] z-40 ml-[34px] h-[7px] w-[7px] rounded-full bg-slate-800" />

          <div className={`phone-scroll relative h-[570px] overflow-y-auto rounded-[2.62rem] bg-[#020714] md:h-[690px] ${viewportClassName}`}>
            <Image
              src={src}
              alt={alt}
              width={520}
              height={1800}
              sizes="(max-width: 640px) 286px, (max-width: 768px) 310px, 338px"
              quality={100}
              priority={false}
              className="block h-auto w-full select-none"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-4 top-0 z-20 h-20 rounded-t-[2.6rem] bg-gradient-to-b from-black/35 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-x-4 bottom-0 z-20 h-24 rounded-b-[2.6rem] bg-gradient-to-t from-black/45 via-black/18 to-transparent" />
        </div>
      </div>
      <p className="mt-5 text-center text-xs font-black uppercase tracking-[0.24em] text-[#5BA3FF]/55">Scroll inside phone</p>
    </div>
  );
}
