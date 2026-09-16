This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Running against the API

This site reads its content from the Devinso API (`Devinso.Api`, in the backend
repo). Two processes, started independently:

```bash
# backend repo
./tools/run-dev.ps1                   # admin :5100, api :5200 (Swagger at /swagger)

# this repo
npm run dev                           # http://localhost:4000
```

`npm run check:api` answers whether the API is up and whether this app is
pointed at it, without starting Next.

### Configuration

Copy `.env.example` to `.env.local` and adjust if your ports differ:

| Variable | Purpose |
| --- | --- |
| `DEVINSO_API_URL` | API origin. Server-side only. Use the HTTP profile — Node rejects the ASP.NET dev certificate. |
| `DEVINSO_MEDIA_URL` | Origin serving uploaded images (the admin app's wwwroot). Must match the API's `Media:BaseUrl`. |
| `DEVINSO_API_TIMEOUT_MS` | How long one call may take before the page gives up on it. |

### How the two talk

Server components call the API origin directly, so the URL never reaches the
client bundle. Browser calls go to `/api/devinso/*` on this origin, which
`next.config.ts` rewrites onto the API — no CORS preflight in dev. Reads happen
on the server today; the proxy matters for the form posts.

**The site renders without the API.** Every read falls back to the bundled
content in `lib/` and `components/Profile/data.ts`, so frontend-only work needs
no backend running. A warning in the dev console names the call that fell back.
A 500 from the API is not swallowed — that is a real bug worth seeing.

### Images

Uploads are served by the admin app, not from `/public`, so `next.config.ts`
allow-lists that origin under `images.remotePatterns` - without it `next/image`
answers 400 with `"url" parameter is not allowed`.

Next 16 also refuses to optimise remote images served from a local IP, which in
development is every upload. That refusal looks identical to a missing pattern,
so `dangerouslyAllowLocalIP` is enabled for development only; production keeps
the default.

Both the API and the media origin are read over HTTP locally, because
`next/image` fetches remote images from the Next server, where Node rejects the
ASP.NET dev certificate.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
