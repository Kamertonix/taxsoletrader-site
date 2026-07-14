Website footer patch — restores Specialist tools column

This patch updates both possible footer locations:
- app/components/SiteFooter.tsx
- components/SiteFooter.tsx

It keeps the legal/support/contact links and restores Specialist tools:
- VAT Return
- Self Assessment
- Receipts
- MTD Reports
- Security

Copy over the site root, then run npm run dev.
