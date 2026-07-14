import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const items = [
  ["Secure access", "The app may support device security options such as PIN, fingerprint, face unlock or Android secure credential where available."],
  ["Data protection", "The platform is designed around protecting bookkeeping, invoice, VAT, CIS, mileage and business records with sensible technical and organisational safeguards."],
  ["User responsibility", "Users should keep devices updated, use strong passwords and maintain independent backups of important accounting records."],
  ["Cloud features", "Where cloud backup, authentication or synchronisation is used, trusted infrastructure providers may process data as needed to operate the service."],
];

export default function SecurityPage() {
  return (
    <main className="premium-bg min-h-screen text-white">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <div className="glass-card rounded-[34px] p-8 md:p-10">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-blue-300">Trust</div>
          <h1 className="mt-4 text-4xl font-black tracking-[-1px] md:text-6xl">Security</h1>
          <p className="mt-5 leading-8 text-slate-300">Security is a core part of the Tax Sole Trader product because users may store sensitive business and bookkeeping records.</p>
          <div className="mt-10 grid gap-6">
            {items.map(([title, text]) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-2xl font-black">{title}</h2>
                <p className="mt-3 leading-7 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
