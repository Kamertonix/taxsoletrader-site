'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Card } from './ui';
import { paidTiers } from './data';

export function PricingTiers() {
  const [annual, setAnnual] = useState(false);
  return (
    <>
      <div className="mt-16 flex items-center justify-center gap-4">
        <span className={`font-bold ${!annual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className="relative h-8 w-14 rounded-full bg-white/10 transition"
          aria-label="Toggle annual pricing"
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-gradient-to-r from-[#5BA3FF] to-[#2F80FF] transition-all ${annual ? 'left-7' : 'left-1'}`}
          />
        </button>
        <span className={`font-bold ${annual ? 'text-white' : 'text-slate-500'}`}>Annual</span>
      </div>
      <p className="mt-3 text-center text-sm text-slate-500">All prices below exclude 20% VAT, which is added at checkout.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {paidTiers.map((p) => {
          const displayPrice = annual ? p.annualPrice : (p.monthlyIntroPrice || p.monthlyPrice);
          const suffix = annual ? '/year excl. 20% VAT' : '/month excl. 20% VAT';
          const strike = !annual && p.monthlyIntroPrice ? p.monthlyPrice : undefined;
          const afterNote = !annual && p.monthlyIntroPrice ? p.monthlyIntroNote : (annual ? p.annualNote : undefined);
          return (
            <Card
              key={p.key}
              className={p.highlight ? 'relative border-[#2F80FF]/50 bg-[#2F80FF]/10 shadow-[0_0_70px_rgba(29,78,216,.16)]' : 'relative'}
            >
              {p.badge && (
                <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-[#5BA3FF] to-[#2F80FF] px-3 py-1 text-xs font-black">
                  {p.badge}
                </div>
              )}
              <h2 className="text-3xl font-black">{p.name}</h2>
              <div className="mt-5 flex flex-wrap items-baseline gap-2">
                {strike && <span className="text-2xl font-bold text-slate-500 line-through">{strike}</span>}
                <span className="text-6xl font-black">{displayPrice}</span>
                <span className="text-lg font-semibold text-slate-400">{suffix}</span>
              </div>
              {afterNote && <p className="mt-2 text-base font-semibold text-[#5BA3FF]">{afterNote}</p>}
              <p className="mt-5 leading-8 text-slate-300">{p.description}</p>
              <ul className="mt-7 grid gap-3 text-slate-300">
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Link
                href="/app"
                className="mt-8 block rounded-2xl bg-gradient-to-r from-[#5BA3FF] via-[#2F80FF] to-[#1D4ED8] px-6 py-4 text-center font-black"
              >
                {p.cta}
              </Link>
            </Card>
          );
        })}
      </div>
    </>
  );
}
