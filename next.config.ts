import type { NextConfig } from "next";

/**
 * The API origin is read here as well as in `lib/api/config.ts`, because a
 * rewrite is evaluated by the Next server rather than by our client module.
 */
const API_ORIGIN = (process.env.DEVINSO_API_URL ?? "http://localhost:5200").replace(/\/$/, "");

/**
 * Origin serving uploaded images (the admin app's wwwroot). Read only by the
 * rewrite below: nothing in the browser ever learns this value, which is the
 * point — see `lib/api/media.ts`. In production it may safely be an
 * internal-network address, since only the Next server resolves it.
 *
 * HTTP in development, because Node rejects the ASP.NET self-signed
 * certificate when the server fetches an upload through the rewrite.
 */
const MEDIA_ORIGIN = (process.env.DEVINSO_MEDIA_URL ?? "http://localhost:5100").replace(/\/$/, "");

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
      {
        // Uploads are stored by the admin panel and served from its origin. The
        // browser is never told that: `lib/api/media.ts` turns every upload URL
        // in an API response into this same-origin path, and the panel's
        // hostname lives only in DEVINSO_MEDIA_URL and in the hop below. A
        // visitor who reads the page source learns nothing about where the
        // panel is, so its login form is not there to be found.
        source: "/uploads/:path*",
        destination: `${MEDIA_ORIGIN}/uploads/:path*`,
      },
    ];
  },

  images: {
    // No remotePatterns on purpose. Every upload reaches next/image as the
    // same-origin path /uploads/..., which the optimiser fetches back through
    // the rewrite above, so no remote origin needs allow-listing. Leaving the
    // list empty also fails closed: an absolute panel URL that somehow escaped
    // `lib/api/media.ts` is refused at render rather than published to the page.

    // Uploads are content-addressed by the admin app — a new upload is a new
    // GUID filename — so an optimised copy never goes stale and there is no
    // reason to re-fetch and re-encode it from the media origin. A year is the
    // same lifetime the admin app now sends on the originals.
    //
    // Safe precisely because the URL changes when the image does; the usual
    // warning about keeping this low applies to origins that overwrite files
    // in place, which this one does not.
    minimumCacheTTL: 31536000,

    // dangerouslyAllowLocalIP and DEVINSO_UNOPTIMIZED_IMAGES both used to live
    // here, and both existed for the same reason: the optimiser had to reach the
    // media origin itself, which is a localhost address in development and not
    // resolvable from inside this container under Docker Compose. Serving
    // uploads through our own rewrite removes that need — the optimiser now
    // fetches its own origin — so the flags are gone.
    //
    // Losing DEVINSO_UNOPTIMIZED_IMAGES also closes the trap it set: it changed
    // both what `next build` wrote into the HTML (a /_next/image URL or a plain
    // src) and whether `next start` served that route at all, so setting it only
    // at runtime made every image on the deployed site 404.
  },
};

export default nextConfig;
