import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Makes the OG image URL and the canonical URL below absolute, which link
  // previews require.
  metadataBase: new URL("https://devinso.ir"),

  // `template` appends the brand to every page title, so a project page can set
  // just "Atlas" and the tab reads "Atlas · Devinso".
  title: {
    default: "Devinso — Digital Product Studio",
    template: "%s · Devinso",
  },
  description:
    "Devinso is a digital product studio — we design brands, build web products, and craft motion-rich interfaces that turn ideas into experiences people remember.",
  keywords: [
    "Devinso",
    "digital product studio",
    "product design",
    "web development",
    "brand design",
    "creative development",
    "UI/UX design",
    "motion design",
  ],
  applicationName: "Devinso",
  authors: [{ name: "Devinso" }],
  creator: "Devinso",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Devinso",
    title: "Devinso — Digital Product Studio",
    description:
      "We design brands, build web products, and craft motion-rich interfaces. A digital product team turning ideas into experiences.",
    url: "/",
    locale: "en_US",
    // Drop your own preview image at app/opengraph-image.png (1200×630) and Next
    // adds it here (and to Twitter) automatically — no code, no metadata edit.
  },
  twitter: {
    card: "summary_large_image",
    title: "Devinso — Digital Product Studio",
    description: "We design brands, build web products, and craft motion-rich interfaces.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-[#050508] antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050508] text-[#f2f0ec] font-sans [font-family:var(--font-geist-sans),Inter,ui-sans-serif,system-ui,sans-serif] [&_a]:text-inherit [&_a]:no-underline [&_a]:[-webkit-tap-highlight-color:transparent] [&_button]:[-webkit-tap-highlight-color:transparent]">{children}</body>
    </html>
  );
}
