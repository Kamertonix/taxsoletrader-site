export const productName = 'Tax Sole Trader®';
export const supportEmail = 'support@taxsoletrader.com';

export const navItems = [
  ['Features', '/features'],
  ['Pricing', '/pricing'],
  ['Support', '/support'],
  ['App', '/app'],
];

export const coreFeatures = [
  {
    icon: '📊',
    title: 'Business Dashboard',
    text: 'A real-time overview for income, expenses, profit, estimated tax, VAT threshold, paid invoices, overdue invoices and business health.',
    bullets: ['Month, quarter and tax-year views', 'VAT threshold tracking', 'Overdue invoice alerts', 'Invoice and receipt KPIs'],
  },
  {
    icon: '🧾',
    title: 'Professional Invoices',
    text: 'Create branded invoices that understand VAT, CIS, reverse charge, due dates, partial payments and payment status.',
    bullets: ['VAT and reverse charge ready', 'CIS deduction logic', 'Paid, unpaid, overdue and part-paid statuses', 'Premium PDF output'],
  },
  {
    icon: '📸',
    title: 'Receipt Hub',
    text: 'Capture and organise receipts by supplier, category, month, quarter and tax year with VAT and accountant export summaries.',
    bullets: ['Camera and gallery workflows', 'Tax-year filtering', 'VAT estimates', 'Category folder style'],
  },
  {
    icon: '📈',
    title: 'Reports & Accountant Pack',
    text: 'Clear income, expense, profit, tax reserve, VAT/CIS summaries and export options for bookkeeping review.',
    bullets: ['PDF reports', 'CSV exports', 'Saved exports', 'Share accountant pack'],
  },
  {
    icon: '🏗️',
    title: 'CIS Accounting',
    text: 'Designed for construction subcontractors and trade businesses with CIS suffered, gross scheme and deduction-aware reporting.',
    bullets: ['20% / 30% handling', 'CIS suffered summaries', 'Invoice-aware calculations', 'Self Assessment support'],
  },
  {
    icon: '🏛️',
    title: 'Direct HMRC Filing',
    text: 'Connect your Government Gateway account and submit VAT returns and quarterly Income Tax updates straight to HMRC, with full fraud-prevention compliance built in.',
    bullets: ['Making Tax Digital (MTD) compliant', 'VAT Return submission', 'Quarterly Income Tax updates', 'Secure, official OAuth connection'],
  },
  {
    icon: '🏦',
    title: 'Bank Connection',
    text: 'Securely connect your UK bank account and keep transactions flowing straight into your records, with full control to review and manage the connection at any time.',
    bullets: ['Secure Open Banking connection', 'Connected account overview', 'Review before it counts', 'Disconnect anytime'],
  },
  {
    icon: '🔐',
    title: 'Privacy & Protection',
    text: 'Local-first thinking, screen privacy mode, controlled exports and clear warnings around sensitive accounting data.',
    bullets: ['Local records', 'Screen privacy mode', 'Backup/export folders', 'Legal protection screen'],
  },
];

export const freePlan = {
  key: 'free',
  name: 'Free',
  badge: null,
  price: '£0',
  priceSuffix: 'forever',
  note: 'No account, no card, no subscription',
  highlight: false,
  cta: 'Use it free',
  description: 'Real day-to-day bookkeeping, on the house. No account, no card, no catch.',
  features: [
    'Invoices — create, share, payment reminders',
    'Transactions — add and categorise',
    'Receipt scanning — OCR, photos, the works',
    'Organizer — tasks, notes, ID & certificates, vehicles, with push reminders',
    'Mileage tracking',
    'Dashboard — profit, income, expenses, monthly performance chart',
    'Reports — monthly performance chart',
    'VAT Return — final net figure (payable or reclaimable)',
    'Self Assessment — threshold warnings, vehicle card, prep panel, records panel',
    'MTD Quarterly — view your report',
    'Share a single invoice or transaction',
  ],
};

export const trialPlan = {
  key: 'trial',
  name: '14-Day Trial',
  badge: 'TRY BASIC',
  price: '£0',
  priceSuffix: 'for 14 days',
  note: 'No card required · once per account',
  highlight: false,
  cta: 'Start free trial',
  description: 'Every Basic feature below, unlocked for 14 days on us — no card, no commitment.',
  features: [
    'Full Basic access, unlocked',
    'No card required to start',
    'Tied to your account, not your device',
    'Automatically moves to your chosen plan after — cancel anytime before then',
  ],
};

export const paidTiers = [
  {
    key: 'basic',
    name: 'Basic',
    badge: null,
    monthlyPrice: '£7.99',
    monthlyIntroPrice: '£3.99',
    monthlyIntroNote: 'for the first 3 months, then £7.99/month',
    annualPrice: '£79.99',
    annualNote: 'No intro offer — already ~£6.67/month',
    highlight: false,
    cta: 'Start Basic',
    description: 'Everything in Free, plus the official breakdowns you need for filing.',
    features: [
      'Everything in Free',
      'VAT Return — full Box 1–9 breakdown, VAT Export, VAT Report PDF, VAT Statement',
      'MTD Quarterly report — full breakdown, PDF/CSV export',
      'Estimated Tax card — Income Tax, Class 2 & Class 4 NI',
      'Full Report card with category breakdown',
      'Self Assessment — full Tax Breakdown calculation',
      'Any export — PDF or CSV',
      'Accountant export pack',
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    badge: 'MOST POPULAR',
    monthlyPrice: '£15.99',
    annualPrice: '£159.99',
    annualNote: 'Two months free versus paying monthly',
    highlight: true,
    cta: 'Start Pro',
    description: 'Everything in Basic, plus filing goes straight to HMRC — no manual submission.',
    features: [
      'Everything in Basic',
      'VAT Return submitted directly to HMRC',
      'MTD Quarterly report submitted directly to HMRC',
    ],
  },
  {
    key: 'complete',
    name: 'Complete',
    badge: null,
    monthlyPrice: '£16.99',
    annualPrice: '£169.99',
    annualNote: 'Two months free versus paying monthly',
    highlight: false,
    cta: 'Start Complete',
    description: 'Everything in Pro, plus a real accountant in your corner.',
    features: [
      'Everything in Pro',
      'Live Accountant Access',
    ],
  },
];


export const screenshots = [
  { src: '/screens/home-grid.jpg', title: 'Customisable Home', text: 'Arrange tools around the way you work.' },
  { src: '/screens/dashboard-year.jpg', title: 'Business Dashboard', text: 'Tax year overview, VAT threshold and overdue invoice tracking.' },
  { src: '/screens/self-assessment.jpg', title: 'Self Assessment', text: 'PAYE, self-employment, CIS, student loan and payments on account.' },
  { src: '/screens/vat-return.jpg', title: 'VAT Return', text: 'Box 1–9 logic with export buttons and MTD-ready summary.' },
  { src: '/screens/receipt-hub.jpg', title: 'Receipt Hub', text: 'Search, filter, categories, VAT estimate and accountant export.' },
  { src: '/screens/reports.jpg', title: 'Reports', text: 'Income, expenses, profit, tax reserve and accountant pack.' },
  { src: '/screens/security.jpg', title: 'Privacy & Security', text: 'Local data notes, screen privacy and export warnings.' },
  { src: '/screens/profile.jpg', title: 'My Profile', text: 'Business, VAT, PAYE, invoice settings and backup tools.' },
];

export const faqs = [
  ['Is Tax Sole Trader for UK sole traders?', 'Yes. The product is designed around UK self-employed workflows including income, expenses, receipts, invoices, VAT, CIS and Self Assessment style reporting.'],
  ['Is there a free version?', 'Yes. The Free plan is genuinely free forever — no account, no card, no subscription. It covers real day-to-day invoicing, transactions, receipts, mileage and a final VAT/Self Assessment figure. Premium adds the detailed breakdowns, exports, bank connection and HMRC filing, with a 14-day free trial (no card required, once per account) before you pay anything.'],
  ['Does it support VAT and Flat Rate VAT?', 'Yes. The app includes standard VAT, Flat Rate VAT, VAT schemes, quarter selection, VAT Return boxes and VAT-related exports.'],
  ['Does it support CIS?', 'Yes. CIS is a core differentiator: CIS suffered, construction workflows, gross scheme and CIS-aware invoice/reporting logic.'],
  ['Can users export reports for accountants?', 'Yes. Export PDF, CSV, saved exports and accountant pack workflows are part of the product positioning.'],
  ['Is it full accounting software?', 'No. The point is to stay simpler than enterprise accounting systems while still covering the real weekly workflows of UK self-employed people.'],
];
