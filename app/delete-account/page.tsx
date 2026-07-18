import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type Block =
  | { type: "p"; text: string }
  | { type: "ol"; items: string[] }
  | { type: "panel"; title: string; text: string; buttonLabel: string; buttonHref: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; text: string };

type Section = {
  title: string;
  blocks: Block[];
};

const sections: Section[] = [
  {
    title: "Option 1 — Delete directly in the app (fastest)",
    blocks: [
      { type: "p", text: "If you still have the app installed:" },
      {
        type: "ol",
        items: [
          "Open Tax Sole Trader",
          "Go to Settings → Account & Cloud",
          "Select Export or delete my data",
          "Choose Delete all my local data to erase everything stored on this device, and/or request deletion of your cloud account if you have one",
          "Confirm the two safety prompts — deletion is immediate and cannot be undone",
        ],
      },
    ],
  },
  {
    title: "Option 2 — Request deletion without the app",
    blocks: [
      {
        type: "p",
        text: "If you've already uninstalled the app, or prefer not to open it, email us and we'll process the request on your behalf:",
      },
      {
        type: "panel",
        title: "Send a deletion request",
        text: 'Email support@taxsoletrader.com from the email address associated with your account, with the subject line "Account and data deletion request".',
        buttonLabel: "Email us to delete my account",
        buttonHref: "mailto:support@taxsoletrader.com?subject=Account%20and%20data%20deletion%20request",
      },
      {
        type: "p",
        text: "We'll verify the request comes from the account owner, then confirm once it's complete — normally within a few business days.",
      },
    ],
  },
  {
    title: "What gets deleted",
    blocks: [
      {
        type: "table",
        headers: ["Data", "What happens"],
        rows: [
          ["Profile & business details", "Permanently deleted"],
          ["Transactions, invoices, expenses, mileage", "Permanently deleted"],
          ["Receipts, documents, exports", "Permanently deleted"],
          ["Cloud account & login credentials", "Permanently deleted"],
          ["Connections to HMRC or a bank (if any)", "Disconnected and revoked"],
        ],
      },
      {
        type: "callout",
        text: "Please note: Tax Sole Trader does not delete or contact HMRC, your bank, or any other third party on your behalf. Deleting your account only removes what's stored within Tax Sole Trader itself.",
      },
    ],
  },
  {
    title: "What we may keep, and why",
    blocks: [
      {
        type: "p",
        text: "UK tax law (HMRC) generally requires self-employed taxpayers to keep business records for at least 5 years after the 31 January submission deadline of the relevant tax year. Deleting your account removes your records from our systems immediately upon request — it is your own responsibility to keep any copies you may still need for this legal retention period (for example, by using the app's export feature before deleting).",
      },
      {
        type: "p",
        text: "Beyond that, we do not retain any personal data after a verified deletion request, except where we are legally required to (for example, a financial transaction record HMRC or a regulator has a legal right to request from us directly).",
      },
    ],
  },
  {
    title: "Questions",
    blocks: [
      {
        type: "p",
        text: "See our full Privacy Policy for more detail on your rights, or contact support@taxsoletrader.com with any question about this process.",
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
    case "ol":
      return (
        <ol key={index} className="mt-3 grid gap-2 leading-7">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3">
              <span className="font-black text-blue-300">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case "panel":
      return (
        <div key={index} className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-black text-white">{block.title}</h3>
          <p className="mt-2 leading-7">{block.text}</p>
          <a
            href={block.buttonHref}
            className="mt-4 inline-block rounded-xl bg-blue-500 px-5 py-3 font-black text-white transition hover:bg-blue-400"
          >
            {block.buttonLabel}
          </a>
        </div>
      );
    case "table":
      return (
        <div key={index} className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[480px] border-collapse text-sm">
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
    case "callout":
      return (
        <div key={index} className="mt-5 rounded-2xl border-l-4 border-red-400 bg-red-400/10 p-5 leading-7">
          {block.text}
        </div>
      );
    default:
      return null;
  }
}

export default function DeleteAccountPage() {
  return (
    <main className="premium-bg min-h-screen text-white">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <div className="glass-card rounded-[34px] p-8 md:p-10">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-blue-300">Your Data</div>
          <h1 className="mt-4 text-4xl font-black tracking-[-1px] md:text-6xl">Delete Your Account &amp; Data</h1>
          <p className="mt-5 leading-8 text-slate-300">
            This page explains how to permanently delete your Tax Sole Trader account and data — whether or not you still have the app installed.
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
