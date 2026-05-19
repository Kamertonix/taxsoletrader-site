import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#010309]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.3fr_.7fr_.7fr_.7fr] lg:px-8">
        <div>
          <Image
            src="/logo-header.png"
            alt="Tax Sole Trader"
            width={340}
            height={90}
            className="h-auto w-[260px]"
          />
          <p className="mt-5 max-w-md leading-7 text-slate-400">
            Premium bookkeeping for UK sole traders, CIS workers, drivers and self-employed professionals.
          </p>
          <p className="mt-5 text-sm text-slate-500">© 2026 Tax Sole Trader™. All rights reserved.</p>
        </div>

        <div>
          <h3 className="font-black text-white">Product</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/app">Download</Link>
          </div>
        </div>

        <div>
          <h3 className="font-black text-white">Company</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <Link href="/support">Support</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>

        <div>
          <h3 className="font-black text-white">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-400">
            <a href="mailto:support@taxsoletrader.com">support@taxsoletrader.com</a>
            <span>United Kingdom</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
