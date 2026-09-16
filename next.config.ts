import type { NextConfig } from "next";

/**
 * The API origin is read here as well as in `lib/api/config.ts`, because a
 * rewrite is evaluated by the Next server rather than by our client module.
 */
const API_ORIGIN = (process.env.DEVINSO_API_URL ?? "http://localhost:5200").replace(/\/$/, "");

/**
 * Origin serving uploaded images (the admin app's wwwroot).
 *
 * HTTP in development: next/image optimises a remote image by fetching it from
 * the Next server, and Node rejects the ASP.NET self-signed certificate, so an
 * https origin fails there even once it is allow-listed.
 */
const MEDIA_ORIGIN = (process.env.DEVINSO_MEDIA_URL ?? "http://localhost:5100").replace(/\/$/, "");

/** Uploads live under /uploads; nothing else on those origins is an image. */
function uploadsPattern(origin: string) {
  const url = new URL(origin);

  return {
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: url.port,
    pathname: "/uploads/**",
  };
}

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
    // Uploads are served by the admin app rather than from /public, so
    // next/image refuses them ("url" parameter is not allowed) until the origin
    // is named here.
    remotePatterns: [uploadsPattern(MEDIA_ORIGIN), uploadsPattern(API_ORIGIN)],

    // Uploads are content-addressed by the admin app — a new upload is a new
    // GUID filename — so an optimised copy never goes stale and there is no
    // reason to re-fetch and re-encode it from the media origin. A year is the
    // same lifetime the admin app now sends on the originals.
    //
    // Safe precisely because the URL changes when the image does; the usual
    // warning about keeping this low applies to origins that overwrite files
    // in place, which this one does not.
    minimumCacheTTL: 31536000,

    // Next 16 refuses to optimise a remote image served from a local IP, which
    // in development is every upload, since the admin app runs on localhost.
    // The refusal looks identical to a missing pattern - 400, "url" parameter
    // is not allowed - so allow-listing the origin alone is not enough.
    //
    // Development only. In production the media origin is a real host, and the
    // default (false) is what keeps the optimiser from being pointed at
    // anything on the deploy target's own network.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
