import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No `rewrites()` here, deliberately.
  //
  // Both proxies this site needs — /api/devinso/* onto the API, /uploads/* onto
  // the admin panel — used to be rewrites, and both were broken in production
  // for the same reason: a rewrite's `destination` is evaluated by `next build`
  // and written into `.next/routes-manifest.json`, and `next start` serves from
  // that manifest without ever re-running this file. The CI job that builds the
  // image has neither DEVINSO_API_URL nor DEVINSO_MEDIA_URL set, so both
  // destinations were frozen to their localhost development defaults; setting
  // the env vars in docker-compose changed nothing, and every request to either
  // path hit a closed port inside the web container and came back 500. Uploaded
  // images then failed twice over: /uploads/... 500d, and next/image turned that
  // into a 400 on /_next/image.
  //
  // They are now route handlers instead — `app/api/devinso/[...path]/route.ts`
  // and `app/uploads/[...path]/route.ts` — which read their origin from the
  // environment on each request, so one image runs correctly in any deployment.

  images: {
    // No remotePatterns on purpose. Every upload reaches next/image as the
    // same-origin path /uploads/..., which the optimiser fetches back through
    // the route handler above, so no remote origin needs allow-listing. Leaving
    // the list empty also fails closed: an absolute panel URL that somehow
    // escaped `lib/api/media.ts` is refused at render rather than published to
    // the page.

    // Uploads are content-addressed by the admin app — a new upload is a new
    // GUID filename — so an optimised copy never goes stale and there is no
    // reason to re-fetch and re-encode it from the media origin. A year is the
    // same lifetime the admin app now sends on the originals.
    //
    // Safe precisely because the URL changes when the image does; the usual
    // warning about keeping this low applies to origins that overwrite files
    // in place, which this one does not.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
