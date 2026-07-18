import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <main className="premium-bg min-h-screen text-white">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <div className="glass-card rounded-[34px] p-8 md:p-10">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-[#5BA3FF]">Contact</div>
          <h1 className="mt-4 text-4xl font-black tracking-[-1px] md:text-6xl">Contact Tax Sole Trader</h1>
          <p className="mt-5 leading-8 text-slate-300">
            For product support, early access, website questions, bug reports or app feedback, contact us by email.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Support email</h2>
              <a className="mt-4 block text-[#5BA3FF]" href="mailto:support@taxsoletrader.com">support@taxsoletrader.com</a>
              <p className="mt-4 leading-7 text-slate-300">Most product enquiries should be sent here. Please include screenshots and device details when reporting a technical issue.</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Important</h2>
              <p className="mt-4 leading-7 text-slate-300">Do not email passwords, full bank login details or unnecessary confidential documents. Support cannot provide regulated tax, legal or accounting advice.</p>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
