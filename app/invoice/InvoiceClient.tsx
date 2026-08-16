'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// Same Supabase project the app itself uses. The anon key is a public,
// non-secret value by design (see supabase/functions/invoice-view --
// it's a PUBLIC, unauthenticated function; the invoice is identified by
// the unguessable token in the URL, not by this key). Row Level Security
// and the Edge Function's own token check are what actually gate access,
// not this key.
const SUPABASE_URL = 'https://zizcipmkvpxsqjtpqarx.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppemNpcG1rdnB4c3FqdHBxYXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODM2NDUsImV4cCI6MjA5NjI1OTY0NX0._z6skyTQKmSpkXNIQmPPurJIECzp0h-BzgfNMpBLFdQ';

interface InvoiceLine {
  description?: string;
  type?: string;
  qty?: string | number;
  rate?: number;
  amount?: number;
}

interface InvoiceData {
  business_name?: string;
  business_owner_name?: string;
  invoice_number?: string;
  client_name?: string;
  invoice_date?: string;
  due_date?: string;
  description?: string;
  lines?: InvoiceLine[];
  net_amount?: number;
  vat_amount?: number;
  reverse_charge?: boolean;
  cis_amount?: number;
  total_amount?: number;
  pdf_url?: string;
  bank_account_holder?: string;
  bank_name?: string;
  bank_sort_code?: string;
  bank_account_number?: string;
  bank_iban?: string;
  bank_payment_reference?: string;
}

function money(value: number): string {
  const clean = Math.abs(value) < 0.005 ? 0 : value;
  const negative = clean < 0;
  const fixed = Math.abs(clean).toFixed(2);
  const [whole, decimals] = fixed.split('.');
  let grouped = '';
  for (let i = 0; i < whole.length; i++) {
    const remaining = whole.length - i;
    if (i > 0 && remaining % 3 === 0) grouped += ',';
    grouped += whole[i];
  }
  return (negative ? '-' : '') + '\u00A3' + grouped + '.' + decimals;
}

// Same embedded logo used in the original page -- kept identical so the
// footer looks the same, no external image request needed.
const FOOTER_LOGO_SRC =
  'data:image/png;base64,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';

export default function InvoiceClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${SUPABASE_URL}/functions/v1/invoice-view/${encodeURIComponent(token)}`, {
      headers: { apikey: SUPABASE_ANON_KEY },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'This invoice link is no longer available.');
        return data as InvoiceData;
      })
      .then((data) => {
        setInvoice(data);
        document.title = `Invoice ${data.invoice_number || ''} — Tax Sole Trader`;
      })
      .catch((err: Error) => {
        setError(err.message || 'Something went wrong loading this invoice.');
      });
  }, [token]);

  if (!token) {
    return (
      <main style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center', color: 'var(--tst-text-muted)', padding: '0 24px' }}>
        <p>This link is missing its invoice reference.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center', color: 'var(--tst-text-muted)', padding: '0 24px' }}>
        <p>{error}</p>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center', color: 'var(--tst-text-muted)', padding: '0 24px' }}>
        <p>Loading invoice...</p>
      </main>
    );
  }

  const lines = Array.isArray(invoice.lines) ? invoice.lines : [];
  const hasBankDetails = Boolean(invoice.bank_account_number || invoice.bank_iban);

  return (
    <main style={{ background: 'var(--tst-bg)', minHeight: '100vh', padding: '24px', fontFamily: '-apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
      <div
        style={{
          maxWidth: 560,
          margin: '0 auto',
          background: 'var(--tst-card)',
          border: '1px solid var(--tst-border)',
          borderRadius: 18,
          padding: 24,
          color: '#E6EDF7',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>{invoice.business_name || invoice.business_owner_name || 'Invoice'}</div>
            <div style={{ color: 'var(--tst-text-muted)', fontSize: 12 }}>Invoice {invoice.invoice_number || ''}</div>
          </div>
          <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--tst-accent)' }}>{money(Number(invoice.total_amount || 0))}</div>
        </div>

        <div style={{ display: 'flex', gap: 18, marginBottom: 16, fontSize: 13, flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: 'var(--tst-text-muted)' }}>Billed to</span>
            <br />
            {invoice.client_name || ''}
          </div>
          <div>
            <span style={{ color: 'var(--tst-text-muted)' }}>Date</span>
            <br />
            {invoice.invoice_date || ''}
          </div>
          <div>
            <span style={{ color: 'var(--tst-text-muted)' }}>Due</span>
            <br />
            {invoice.due_date || ''}
          </div>
        </div>

        {invoice.description && <p style={{ fontSize: 14, lineHeight: 1.5 }}>{invoice.description}</p>}

        {lines.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: '8px 4px', borderBottom: '1px solid var(--tst-border)', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '8px 4px', borderBottom: '1px solid var(--tst-border)', textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '8px 4px', borderBottom: '1px solid var(--tst-border)', textAlign: 'right' }}>Rate</th>
                <th style={{ padding: '8px 4px', borderBottom: '1px solid var(--tst-border)', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--tst-border)' }}>{line.description || line.type || ''}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--tst-border)', textAlign: 'right' }}>{line.qty || ''}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--tst-border)', textAlign: 'right' }}>{money(Number(line.rate || 0))}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--tst-border)', textAlign: 'right' }}>{money(Number(line.amount || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: 16 }}>
          <TotalsRow label="Net" value={money(Number(invoice.net_amount || 0))} />
          {invoice.reverse_charge ? (
            <TotalsRow label="VAT" value="Reverse charge - customer to account for VAT" />
          ) : (
            <TotalsRow label="VAT" value={money(Number(invoice.vat_amount || 0))} />
          )}
          {Number(invoice.cis_amount || 0) > 0 && <TotalsRow label="CIS deduction" value={`-${money(Number(invoice.cis_amount || 0))}`} />}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 900,
              fontSize: 16,
              borderTop: '1px solid var(--tst-border)',
              marginTop: 6,
              paddingTop: 10,
            }}
          >
            <span>Total</span>
            <span>{money(Number(invoice.total_amount || 0))}</span>
          </div>
        </div>

        {invoice.pdf_url && (
          <div style={{ marginTop: 16 }}>
            <a
              href={invoice.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                background: 'var(--tst-accent-dark)',
                color: '#E6EDF7',
                textDecoration: 'none',
                padding: 12,
                borderRadius: 12,
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              Download PDF
            </a>
          </div>
        )}

        {hasBankDetails && (
          <div style={{ marginTop: 16, background: 'var(--tst-bg)', border: '1px solid var(--tst-success)', borderRadius: 14, padding: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 14, color: 'var(--tst-success)', marginBottom: 6 }}>💳 Pay Now — Bank Transfer</div>
            <div style={{ fontSize: 12, color: 'var(--tst-text-muted)', marginBottom: 10, lineHeight: 1.4 }}>
              Pay directly from your bank using these details. Please include the payment reference so it&apos;s matched to this invoice.
            </div>
            <div>
              {invoice.bank_account_holder && <BankRow label="Account name" value={invoice.bank_account_holder} />}
              {invoice.bank_name && <BankRow label="Bank" value={invoice.bank_name} />}
              {invoice.bank_sort_code && <BankRow label="Sort code" value={invoice.bank_sort_code} />}
              {invoice.bank_account_number && <BankRow label="Account number" value={invoice.bank_account_number} />}
              {invoice.bank_iban && <BankRow label="IBAN" value={invoice.bank_iban} />}
              {invoice.bank_payment_reference && <BankRow label="Payment reference" value={invoice.bank_payment_reference} />}
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 560, margin: '22px auto 0' }}>
        <div style={{ display: 'flex', height: 3, borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
          <span style={{ flex: 72, background: 'var(--tst-accent)' }} />
          <span style={{ flex: 28, background: 'var(--tst-warning)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOOTER_LOGO_SRC} alt="" width={26} height={26} style={{ borderRadius: 6, opacity: 0.92, flexShrink: 0 }} />
          <div style={{ fontSize: 11, color: 'var(--tst-text-muted)', lineHeight: 1.6, textAlign: 'left' }}>
            &copy; {new Date().getFullYear()} Tax Sole Trader. Built for UK Sole Traders. VAT | CIS | Self Assessment.
            <br />
            Proprietary document template. Generated locally by Tax Sole Trader.
          </div>
        </div>
      </div>
    </main>
  );
}

function TotalsRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
      <span style={{ color: 'var(--tst-text-muted)' }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function BankRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13 }}>
      <span style={{ color: 'var(--tst-text-muted)' }}>{label}</span>
      <span style={{ fontWeight: 800 }}>{value}</span>
    </div>
  );
}
