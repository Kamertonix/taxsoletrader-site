import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tax Sole Trader™ — UK Sole Trader Bookkeeping',
  description: 'Premium bookkeeping app for UK sole traders, CIS workers, delivery drivers, taxi drivers and self-employed professionals. Invoices, receipts, VAT, CIS, Self Assessment, reports and accountant exports.',
  keywords: ['UK sole trader app','CIS bookkeeping','VAT return app','self assessment app','receipt scanner','invoice app UK','tax sole trader'],
  openGraph: {
    title: 'Tax Sole Trader™ — Accounting Made Simple. Taxes Made Easy.',
    description: 'A premium bookkeeping platform built around real UK self-employed workflows.',
    url: 'https://taxsoletrader.com',
    siteName: 'Tax Sole Trader',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    locale: 'en_GB',
    type: 'website',
  },
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
