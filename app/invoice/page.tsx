import type { Metadata } from 'next';
import { Suspense } from 'react';
import InvoiceClient from './InvoiceClient';

export const metadata: Metadata = {
  title: 'Invoice — Tax Sole Trader',
  description: 'View your invoice details and pay securely online.',
  openGraph: {
    title: 'Invoice — Tax Sole Trader',
    description: 'View your invoice details and pay securely online.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Invoice — Tax Sole Trader',
    description: 'View your invoice details and pay securely online.',
  },
  // This page shows one specific person's invoice data behind an
  // unguessable token -- there's nothing here worth a search engine
  // crawling or indexing.
  robots: { index: false, follow: false },
};

export default function InvoicePage() {
  return (
    <Suspense fallback={<InvoiceLoading />}>
      <InvoiceClient />
    </Suspense>
  );
}

function InvoiceLoading() {
  return (
    <main style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center', color: 'var(--tst-text-muted)', padding: '0 24px' }}>
      <p>Loading invoice...</p>
    </main>
  );
}
