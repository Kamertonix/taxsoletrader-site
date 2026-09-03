import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SectionTitle from "@/components/SectionTitle";

const supportCards = [
  ["Getting started", "Help with profile setup, tax year, VAT, CIS, vehicle method, invoices and first reports."],
  ["Technical support", "Report app crashes, layout issues, login problems, biometric lock issues, PDF export issues or device-specific problems."],
  ["Scanner and receipts", "Help with receipt scanning, merchant rules, OCR and transaction review."],
  ["Reports and exports", "Questions about accountant exports, VAT summaries, Self Assessment reports, mileage summaries and document organisation."],
];

const faqs = [
  ["Does Tax Sole Trader submit directly to HMRC?", "The product is designed to organise records and prepare reports. Direct filing or MTD features depend on the final released version and should be checked before relying on it."],
  ["Can support give tax advice?", "Support can help with app functionality, but it cannot provide regulated tax, legal or accounting advice."],
  ["What should I include in a support request?", "Include your device model, Android version, app version, the screen name, screenshots if useful and a clear description of the issue."],
  ["Should I email bank passwords or confidential access details?", "No. Never send banking passwords, app passwords or unnecessary sensitive credentials by email."],
];

export default function SupportPage() {
  return (
    <main className="premium-bg min-h-screen text-white">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-20 lg:px-8">
        <SectionTitle
          eyebrow="Support"
          title="Tax Sole Trader Support Centre"
          text="Professional support for the website and app. For legal, tax or accounting decisions, please speak to a qualified adviser."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="glass-card rounded-[34px] p-8">
            <h2 className="text-2xl font-black">Email support</h2>
            <p className="mt-4 leading-8 text-slate-300">
              Use this email for app questions, bug reports, launch access, account issues and general product support.
            </p>
            <a href="mailto:support@taxsoletrader.com" className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-[#5BA3FF] via-[#2F80FF] to-[#1D4ED8] px-6 py-4 text-sm font-black">
              support@taxsoletrader.com
            </a>
          </div>
          <div className="glass-card rounded-[34px] p-8">
            <h2 className="text-2xl font-black">Before contacting us</h2>
            <div className="mt-5 grid gap-3 text-slate-300">
              <p>• Include device model, Android version and app version.</p>
              <p>• Tell us exactly which screen has the issue.</p>
              <p>• Add screenshots where possible.</p>
              <p>• Do not send passwords or banking credentials.</p>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {supportCards.map(([title, text]) => (
            <div key={title} className="glass-card rounded-[28px] p-7">
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 glass-card rounded-[34px] p-8">
          <h2 className="text-2xl font-black">FAQ</h2>
          <div className="mt-6 grid gap-6 text-slate-300">
            {faqs.map(([q, a]) => (
              <div key={q}>
                <h3 className="font-black text-white">{q}</h3>
                <p className="mt-2 leading-7">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
