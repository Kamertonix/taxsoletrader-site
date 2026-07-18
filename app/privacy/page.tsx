import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    };

type Section = {
  title: string;
  blocks: Block[];
};

const sections: Section[] = [
  {
    title: "1. Who we are",
    blocks: [
      {
        type: "p",
        text: 'Tax Sole Trader is a bookkeeping, VAT, CIS and Self Assessment app built for UK sole traders, published by Kamertonix Ltd ("Tax Sole Trader", "we", "us", "our"). We are the data controller for the personal information described in this policy.',
      },
      {
        type: "ul",
        items: [
          "Registered address: 13 Stilwell Close, Orpington, England, BR5 3FA",
          "Company number: 17240499",
          "ICO registration number: to be added once confirmed",
        ],
      },
    ],
  },
  {
    title: "2. Scope of this policy",
    blocks: [
      {
        type: "p",
        text: "This policy explains what information Tax Sole Trader handles, why, where it is stored, who else (if anyone) processes it, and what rights you have over it. It applies whether you use the app entirely offline or choose to enable any of its optional online features (cloud account, bank connection, HMRC connection, or a paid subscription).",
      },
      {
        type: "p",
        text: "It does not apply to any other product, website, or service, even if operated by us, unless linked directly from this document.",
      },
    ],
  },
  {
    title: "3. Information we collect",
    blocks: [
      {
        type: "p",
        text: 'Tax Sole Trader is a bookkeeping tool, so most of what it "collects" is information you type in or import yourself, for your own records. We group it here by category, matching how it is actually used inside the app.',
      },
      { type: "h3", text: "3.1 Personal and business identity information" },
      {
        type: "ul",
        items: [
          "Your name and business name",
          "Business address",
          "Email address and phone number",
          "UK Unique Taxpayer Reference (UTR), National Insurance number (NINO), and VAT registration number, where you choose to enter them",
        ],
      },
      { type: "h3", text: "3.2 Financial and tax information" },
      {
        type: "ul",
        items: [
          "Income and expense transactions you record or import",
          "Invoices and the client/employer details you attach to them",
          "VAT, CIS (Construction Industry Scheme), and Self Assessment figures calculated from your records",
          "Mileage logs and vehicle details",
          "Bank statement data you choose to import (CSV/PDF) or, if you connect a bank account, transaction data retrieved on your behalf (see section 7)",
        ],
      },
      { type: "h3", text: "3.3 Files and documents" },
      {
        type: "ul",
        items: [
          "Photos of receipts, invoices, ID documents and certificates you attach",
          "Generated PDF/CSV exports (invoices, VAT returns, Self Assessment summaries, accountant packs)",
          "Imported bank statement files",
        ],
      },
      { type: "h3", text: "3.4 App diagnostics and support information" },
      {
        type: "ul",
        items: [
          "Local data health and readiness indicators generated on your device (e.g. whether required settings are complete)",
          "Export/backup history metadata (e.g. when a backup was last created)",
        ],
      },
      {
        type: "p",
        text: "Tax Sole Trader does not collect your contacts, precise or approximate location, SMS/call logs, microphone or camera audio/video (only the photos you deliberately capture or select), health data, or an advertising identifier. If a future version of the app adds any of these, this policy — and the Google Play Data Safety declaration — will be updated first.",
      },
    ],
  },
  {
    title: "4. How we use your information",
    blocks: [
      { type: "p", text: "We use the information described above only to:" },
      {
        type: "ul",
        items: [
          "Perform the bookkeeping, VAT, CIS, mileage and Self Assessment calculations you use the app for",
          "Generate the invoices, reports and exports you request",
          "Let you back up your records and, if you choose, use the app across more than one device",
          "Provide customer support when you contact us",
          "Maintain the security and reliability of the app",
          "Meet our own legal obligations, such as responding to a valid request from a regulator or law enforcement body",
        ],
      },
      { type: "p", text: "We do not sell your information, and we do not use it to build an advertising profile of you." },
    ],
  },
  {
    title: "5. Local-first storage — how the app works by default",
    blocks: [
      {
        type: "p",
        text: "Tax Sole Trader is designed to work fully offline. By default, everything you enter — transactions, invoices, expenses, mileage, organizer items, settings — is stored only on your own device, using standard local app storage. No account is required to use these core features, and nothing is uploaded anywhere unless you deliberately choose one of the optional online features described below.",
      },
      {
        type: "p",
        text: "Because this data lives on your device, you are responsible for keeping your device secure (e.g. using a screen lock) and for backing up your records — the app includes a manual backup/export feature for exactly this purpose.",
      },
    ],
  },
  {
    title: "6. Optional cloud account and sync",
    blocks: [
      {
        type: "p",
        text: "If you choose to create an account (for backup or to use the app on more than one device), your records are synchronised to secure cloud infrastructure operated on our behalf by our backend provider (see section 12). This is entirely optional — declining or ignoring this feature has no effect on the app's core offline functionality.",
      },
      { type: "p", text: "When cloud sync is active:" },
      {
        type: "ul",
        items: [
          "Your data is associated with your account and is not visible to other users of the app",
          "Access to your records in transit and at rest is protected using industry-standard encryption and access controls",
          "You can request deletion of your cloud-stored data at any time (see sections 15–16)",
        ],
      },
      { type: "p", text: "You can sign in with an email and password, or using your Google account (see section 10)." },
    ],
  },
  {
    title: "7. Optional bank connection (Open Banking)",
    blocks: [
      {
        type: "p",
        text: "Tax Sole Trader offers an optional bank connection feature, allowing transaction data to be retrieved directly from your bank via regulated UK Open Banking infrastructure, instead of you importing statement files by hand. This feature is opt-in: it is never activated without you explicitly choosing to connect a specific bank account.",
      },
      {
        type: "p",
        text: "Where this feature is used, our Open Banking provider, TrueLayer, facilitates the secure connection between your bank and the app; we never see or store your online banking password. You can disconnect a connected bank account at any time from within the app, which stops any further data retrieval from that account.",
      },
      {
        type: "p",
        text: "Imported bank transactions are treated the same as any other transaction in the app: stored locally (and in your cloud account, if enabled), and never shared with anyone beyond what this policy describes.",
      },
    ],
  },
  {
    title: "8. Connecting to HMRC (Making Tax Digital)",
    blocks: [
      {
        type: "p",
        text: "If you choose to connect your Government Gateway account, the app can retrieve your VAT obligations and submit VAT returns, and submit quarterly Income Tax updates, directly to HMRC, as part of the UK's Making Tax Digital service. This connection uses HMRC's own official OAuth authorisation flow — you sign in directly with HMRC (via Government Gateway), and we never see or store your Government Gateway credentials.",
      },
      {
        type: "p",
        text: 'Where required by HMRC for this connection method, the app also collects a small set of technical "fraud prevention" details (such as device identifier, timezone, and screen dimensions) and sends them to HMRC alongside each request, exactly as HMRC\'s Making Tax Digital specification requires of all compliant software.',
      },
    ],
  },
  {
    title: "9. Receipt and document scanning (OCR)",
    blocks: [
      {
        type: "p",
        text: "When you photograph a receipt, certificate or ID document, the app reads it using on-device text recognition (Google's ML Kit, running locally on your phone). The photo is never uploaded anywhere for this purpose — recognition happens entirely on your device, with no internet connection required and no image data sent to us, to Google, or to anyone else. Any supplier, amount, date or document details the app fills in automatically are always shown to you, editable, before anything is saved.",
      },
    ],
  },
  {
    title: "10. Signing in with Google",
    blocks: [
      {
        type: "p",
        text: "If you choose to sign in using your Google account, Google shares your name and email address with us (via our backend provider's authentication system) so that we can create or recognise your account. We do not receive your Google password, and we only request the minimum access needed to confirm your identity.",
      },
    ],
  },
  {
    title: "11. Subscriptions and payment",
    blocks: [
      {
        type: "p",
        text: "Paid subscription features, where available, are billed through Google Play Billing. Google processes your payment details directly — we never see or store your card number or other payment credentials. We receive only confirmation of your subscription status (e.g. active, cancelled, expired) so the app can unlock the relevant features.",
      },
    ],
  },
  {
    title: "12. Third parties who process data on our behalf",
    blocks: [
      {
        type: "p",
        text: "We use a small number of specialist providers to operate the app. Each is bound by its own data processing terms and only processes data for the specific purpose described here — none of them are permitted to use your data for their own advertising or other unrelated purposes.",
      },
      {
        type: "table",
        headers: ["Provider", "Purpose", "Data involved"],
        rows: [
          [
            "Supabase, Inc. (hosted in the EU — West EU, Ireland)",
            "Cloud database, authentication and file storage, used only if you enable a cloud account",
            "Account details and synced records, if cloud sync is enabled",
          ],
          [
            "Google LLC",
            "Sign-in (optional), on-device receipt text recognition (ML Kit — no data leaves your device), Play Billing (subscriptions), and Play Store distribution",
            "Google account email/name (sign-in only); payment status (Play Billing only)",
          ],
          [
            "HM Revenue & Customs",
            "Making Tax Digital VAT and Income Tax obligations and submissions, if you connect your Government Gateway account",
            "VAT and income figures you choose to submit; fraud-prevention technical headers required by HMRC",
          ],
          [
            "TrueLayer",
            "Regulated bank connection, if you choose to connect a bank account",
            "Bank transaction data you authorise for retrieval",
          ],
          [
            "Sentry (crash reporting)",
            "Diagnosing app crashes so we can fix them",
            "Error/crash reports only — no personal data, screen contents or financial figures are included",
          ],
        ],
      },
      { type: "p", text: "We do not use any advertising or behavioural-tracking SDKs, so no data is shared with advertising networks." },
    ],
  },
  {
    title: "13. Our legal basis for processing your information",
    blocks: [
      { type: "p", text: "Under UK GDPR, we rely on the following legal bases, depending on the feature:" },
      {
        type: "ul",
        items: [
          "Performance of a contract — to provide the core bookkeeping features you've asked to use, including any paid subscription",
          "Consent — for optional features you actively choose to turn on, such as cloud sync, bank connection, or Google Sign-In; you can withdraw this consent at any time by disabling the feature",
          "Legal obligation — where we must retain or disclose information to comply with UK law (e.g. a lawful request from HMRC or a court)",
          "Legitimate interests — for keeping the app secure and reliable (including crash diagnostics), in a way that does not override your own privacy rights",
        ],
      },
    ],
  },
  {
    title: "14. How long we keep your information",
    blocks: [
      {
        type: "p",
        text: "Records stored locally on your device remain there until you delete them, uninstall the app, or use the account/data deletion feature described in section 16 — this is entirely under your control.",
      },
      {
        type: "p",
        text: "For your own reference: HMRC generally requires self-employed taxpayers to keep business records for at least 5 years after the 31 January submission deadline of the relevant tax year. The app does not enforce this for you, but we recommend not deleting records you may still need for this reason.",
      },
      {
        type: "p",
        text: "If you use the optional cloud account, we retain your cloud-stored data for as long as your account remains active, and delete it within a reasonable period after a verified deletion request (see section 16), except where we are legally required to retain specific records for longer.",
      },
    ],
  },
  {
    title: "15. Your rights",
    blocks: [
      { type: "p", text: "Under UK data protection law, you have the right to:" },
      {
        type: "ul",
        items: [
          "Access the personal information we hold about you",
          "Correct inaccurate or incomplete information (most fields in the app can simply be edited directly)",
          "Export your data in a portable format",
          "Request deletion of your information, subject to any legal retention obligations described in section 14",
          "Object to or restrict certain processing, in particular anything based on consent (see section 13) — you can withdraw consent at any time",
          "Complain to the Information Commissioner's Office (ICO) if you believe we have not handled your information properly — see ico.org.uk",
        ],
      },
    ],
  },
  {
    title: "16. How to exercise your rights",
    blocks: [
      {
        type: "p",
        text: "For data stored only on your device, you have direct control at all times: every record can be viewed, edited or deleted from within the app, and Settings → Account & Cloud includes a dedicated data export and account/data deletion request tool.",
      },
      {
        type: "p",
        text: "For anything we hold on our servers (i.e. only if you have enabled a cloud account), contact us using the details in section 22 and we will respond within one month, as required by law. We may need to verify your identity before actioning a request.",
      },
      {
        type: "p",
        text: "If you have a question or concern specifically about how we handle your personal data, you can also contact Iulian at Kamertonix Ltd directly, using the details in section 22.",
      },
    ],
  },
  {
    title: "17. How we protect your information",
    blocks: [
      {
        type: "ul",
        items: [
          "Local data benefits from your device's own operating system security (and, if you set one, the app's own PIN lock)",
          "Cloud-stored data (if enabled) is encrypted in transit (HTTPS/TLS) and at rest, with database-level access rules ensuring one user's records are never visible to another",
          "We do not embed any server-side secret keys inside the app itself",
          "Bank and HMRC connections use official, regulated OAuth flows — we never see or store your banking or Government Gateway password",
          "We maintain a documented internal process for identifying, containing and reporting any security incident to the relevant authorities within the legally required timeframes",
        ],
      },
      { type: "p", text: "No method of storage or transmission is 100% secure, but we design and review the app specifically to minimise risk to your data." },
    ],
  },
  {
    title: "18. International data transfers",
    blocks: [
      {
        type: "p",
        text: "If you enable cloud sync, your data is processed on servers operated by our backend provider, Supabase, in their West EU (Ireland) region. As this is within the European Economic Area, transfers of your data there are already covered by the UK's own data protection framework and do not require additional safeguards beyond what is described in this policy.",
      },
    ],
  },
  {
    title: "19. Children's privacy",
    blocks: [
      {
        type: "p",
        text: "Tax Sole Trader is a business/tax tool intended for adult sole traders and is not directed at, or knowingly used to collect information from, children. If you believe a child has provided us with personal information, please contact us so we can remove it.",
      },
    ],
  },
  {
    title: "20. No advertising or behavioural tracking",
    blocks: [
      {
        type: "p",
        text: "Tax Sole Trader does not display third-party advertising and does not use analytics or tracking SDKs to build a profile of your behaviour across other apps or websites. Any diagnostics collected (see section 3.4) stay on your device and are used only to help the app function correctly.",
      },
    ],
  },
  {
    title: "21. Changes to this policy",
    blocks: [
      {
        type: "p",
        text: 'We may update this policy from time to time, for example if we add a new feature that changes what data the app collects. We will update the "Last updated" date at the top of this page, and where a change is significant, we will make reasonable efforts to bring it to your attention within the app before it takes effect.',
      },
    ],
  },
  {
    title: "22. Contact us",
    blocks: [
      { type: "p", text: "If you have any question about this policy or how your information is handled, contact us at:" },
      {
        type: "ul",
        items: [
          "Email: support@taxsoletrader.com",
          "Postal address: Kamertonix Ltd, 13 Stilwell Close, Orpington, England, BR5 3FA",
        ],
      },
    ],
  },
];

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={index} className="mt-3 leading-8">
          {block.text}
        </p>
      );
    case "h3":
      return (
        <h3 key={index} className="mt-5 text-lg font-black text-white">
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul key={index} className="mt-3 grid gap-2 leading-7">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-blue-300">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={index} className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-white/5">
                {block.headers.map((header) => (
                  <th key={header} className="p-3 text-left font-black text-white">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-white/10 align-top">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-3 leading-6 text-slate-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default function PrivacyPage() {
  return (
    <main className="premium-bg min-h-screen text-white">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <div className="glass-card rounded-[34px] p-8 md:p-10">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-blue-300">Legal</div>
          <h1 className="mt-4 text-4xl font-black tracking-[-1px] md:text-6xl">Privacy Policy</h1>
          <p className="mt-5 leading-8 text-slate-300">
            Last updated: 18 July 2026. Applies to the Tax Sole Trader mobile application for Android (and, where applicable, other platforms distributing the same app).
          </p>
          <div className="mt-10 grid gap-8 text-slate-300">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-black text-white">{section.title}</h2>
                {section.blocks.map((block, index) => renderBlock(block, index))}
              </section>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
