Tax Sole Trader complete website drop-in v2

Copy these folders into:
C:\Users\iMac\taxsoletrader-site

Folders included:
- app
- components

Keep your existing:
- public/logo-header.png
- public/favicon.png
- public/logo-taxsoletrader-dark.png if you still use it
- package.json
- node_modules
- .git

After copying:
1. npm run dev
2. Open http://localhost:3000
3. If OK:
   git add .
   git commit -m "Complete Tax Sole Trader website"
   git push

Pages:
- /
- /features
- /pricing
- /support
- /privacy
- /terms
- /app

Important:
The /app page is the universal QR code page:
https://taxsoletrader.com/app

Google Play and App Store links are placeholders. Replace later in app/app/page.tsx.
