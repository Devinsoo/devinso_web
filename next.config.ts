import type { NextConfig } from "next";

/**
 * The API origin is read here as well as in `lib/api/config.ts`, because a
 * rewrite is evaluated by the Next server rather than by our client module.
 */
const API_ORIGIN = (process.env.DEVINSO_API_URL ?? "http://localhost:5225").replace(/\/$/, "");

/** Origin serving uploaded images (the admin app's wwwroot). */
const MEDIA_ORIGIN = process.env.DEVINSO_MEDIA_URL ?? "https://localhost:7019";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Browser-side calls go to our own origin and are proxied from here, so
        // the client never needs a CORS preflight and the API origin stays out
        // of the bundle. Server-side calls skip this and hit the API directly.
        source: "/api/devinso/:path*",
        destination: `${API_ORIGIN}/api/v1/:path*`,
      },
    ];
  },

  images: {
    // Uploads are served by the admin app, not from /public, so next/image
    // needs both dev origins named before it will optimise them.
    remotePatterns: [
      new URL(`${MEDIA_ORIGIN}/uploads/**`),
      new URL(`${API_ORIGIN}/uploads/**`),
    ],
  },
};

export default nextConfig;
