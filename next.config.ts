import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  turbopack: {
    root: path.join(__dirname),
  },
  // Old static privacy policy files (removed 30 Sept 2026). Store
  // listings (Google Play, App Store) may still link to these URLs,
  // so they must keep working: send them to the current page.
  async redirects() {
    return [
      { source: "/Privacy-Policy.html", destination: "/privacy", permanent: true },
      { source: "/privacy-policy.html", destination: "/privacy", permanent: true },
      { source: "/legal/privacy-policy.html", destination: "/privacy", permanent: true },
      { source: "/legal/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
    ];
  },
};

export default nextConfig;
