import Link from "next/link";
import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <div className="rounded-[32px] border border-white/10 bg-[#071120]/70 p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row">
          <div>
            <Image src="/logo-header.png" alt="Tax Sole Trader" width={320} height={90} className="h-auto w-[260px]" />
            <p className="mt-4 max-w-md leading-7 text-[#B8C1D1]">
              Premium bookkeeping for UK sole traders, CIS workers, drivers and self-employed professionals.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="font-black">Product</div>
              <div className="mt-4 grid gap-3 text-sm text-[#B8C1D1]">
                <Link href="/features">Features</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/support">Support</Link>
              </div>
            </div>
            <div>
              <div className="font-black">Legal</div>
              <div className="mt-4 grid gap-3 text-sm text-[#B8C1D1]">
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms</Link>
              </div>
            </div>
            <div>
              <div className="font-black">Contact</div>
              <div className="mt-4 grid gap-3 text-sm text-[#B8C1D1]">
                <a href="mailto:support@taxsoletrader.com">support@taxsoletrader.com</a>
                <span>United Kingdom</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-[#7C8799]">
          © 2026 Tax Sole Trader™. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
