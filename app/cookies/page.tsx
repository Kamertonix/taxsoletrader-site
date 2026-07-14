import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function CookiesPage() {
  return (
    <main className="premium-bg min-h-screen text-white">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <div className="glass-card rounded-[34px] p-8 md:p-10">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-blue-300">Legal</div>
          <h1 className="mt-4 text-4xl font-black tracking-[-1px] md:text-6xl">Cookie Policy</h1>
          <div className="mt-8 grid gap-7 leading-8 text-slate-300">
            <p>Tax Sole Trader may use essential cookies or similar technologies required for the website to function, maintain security and remember basic preferences.</p>
            <p>If analytics, advertising pixels, conversion tracking or optional cookies are added in future, the website should provide clear information and any required consent controls before those tools are used.</p>
            <p>You can usually control cookies through your browser settings. Blocking essential cookies may affect website functionality.</p>
            <p>Questions: <a className="text-cyan-300" href="mailto:support@taxsoletrader.com">support@taxsoletrader.com</a></p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
