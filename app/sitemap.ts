import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://taxsoletrader.com';
  const now = new Date();

  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/app', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/vat-return', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/self-assessment', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/receipts', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/mtd-reports', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/security', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/support', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/delete-account', priority: 0.3, changeFrequency: 'yearly' },
  ];

  return pages.map((page) => ({
    url: `${base}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
