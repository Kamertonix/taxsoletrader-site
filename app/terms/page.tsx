import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const sections = [
  ["1. Acceptance of terms", "By accessing the Tax Sole Trader™ website, mobile application or related services, you agree to these Terms & Conditions. If you do not agree, you should not use the service."],
  ["2. Product purpose", "Tax Sole Trader is designed to help UK sole traders, CIS subcontractors, drivers, tradespeople and self-employed professionals organise bookkeeping records, invoices, receipts, mileage, VAT information, CIS information, reports and exports."],
  ["3. Not professional advice", "The service is a software product. It does not provide regulated tax, accounting, legal, investment or financial advice. Users remain responsible for checking records, calculations, filings, VAT returns, CIS entries, Self Assessment information and any information provided to HMRC, an accountant or another party."],
  ["4. User responsibility", "You are responsible for entering accurate information, reviewing imported data, checking calculations, keeping backup records, protecting login credentials and ensuring that any submissions or exports are correct before use."],
  ["5. VAT, CIS, mileage and tax features", "VAT, CIS, mileage and tax-related features are provided to assist record keeping. They may rely on user settings, selected tax year, transaction categories, imported data and business profile information. If settings are incorrect, reports may be incorrect."],
  ["6. Bank connection, OCR and automation", "Bank account connection, receipt scanning, OCR, smart rules and AI-assisted tools may save time but can make mistakes. Users must review classifications, amounts, dates, VAT treatment, CIS treatment and business/private allocation before relying on the output."],
  ["7. Account and security", "Users must keep devices, passwords, PINs and biometric access secure. We may restrict access where misuse, fraud, security concerns or breach of these terms is suspected."],
  ["8. Subscriptions and payments", "If paid plans, subscriptions, trials or premium features are introduced, pricing and renewal terms should be shown before purchase. App store or payment provider rules may also apply."],
  ["9. Availability", "We aim to provide a reliable service, but availability may be affected by maintenance, updates, third-party services, network issues, app store systems, cloud infrastructure or technical faults."],
  ["10. Acceptable use", "You must not use the service unlawfully, attempt unauthorised access, upload malicious content, interfere with the platform, copy the product, reverse engineer protected features, abuse support channels or misrepresent financial records."],
  ["11. Intellectual property", "The Tax Sole Trader name, logo, interface, website, app design, original content, product structure, graphics and related materials belong to their respective owner unless otherwise stated. You may not copy, clone or redistribute them without permission."],
  ["12. Third-party services", "The product may connect with hosting, analytics, cloud storage, authentication, app store, email, payment or support providers. Their own terms and privacy policies may apply."],
  ["13. Limitation of liability", "To the maximum extent permitted by law, Tax Sole Trader is not responsible for indirect losses, missed deadlines, penalties, loss of profit, business interruption, data entered incorrectly by the user, third-party service failures or decisions made without professional review."],
  ["14. Changes to features or terms", "Features, screens, pricing, wording and policies may be updated as the product develops. The website and app should remain aligned so users receive consistent legal information."],
  ["15. Contact", "Questions about these terms should be sent to support@taxsoletrader.com."],
];

export default function TermsPage() {
  return (
    <main className="premium-bg min-h-screen text-white">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <div className="glass-card rounded-[34px] p-8 md:p-10">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-blue-300">Legal</div>
          <h1 className="mt-4 text-4xl font-black tracking-[-1px] md:text-6xl">Terms & Conditions</h1>
          <p className="mt-5 leading-8 text-slate-300">
            Last updated: 2026. These terms are written to match the website and in-app legal structure for Tax Sole Trader™.
          </p>
          <div className="mt-10 grid gap-8 text-slate-300">
            {sections.map(([title, text]) => (
              <section key={title}>
                <h2 className="text-2xl font-black text-white">{title}</h2>
                <p className="mt-3 leading-8">{text}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
