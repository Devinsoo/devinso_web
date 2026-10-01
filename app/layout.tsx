import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ScrollToTop } from "@/components/AppShell/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Persian UI font (all nine Morabba weights); see the `data-locale="fa"`
// rules in globals.css. The family ships both Black and Heavy at OS/2 weight
// 900, so Heavy is mapped to 950 to keep the two distinguishable.
//
// Morabba is limited to the Arabic-script ranges. Its own Latin letters are
// tightly set and its space is only 0.09em, so English words and the gaps
// between words fall through to Geist — the face the English site uses. The
// Arial-based metric fallback is off for the same reason: it would otherwise
// catch those Latin characters before Geist does.
const morabba = localFont({
  variable: "--font-morabba",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      // Arabic, Arabic Supplement, Arabic Extended-A, presentation forms A/B,
      // and ZWNJ/ZWJ/direction marks (U+200C–200F) that Persian relies on.
      value: "U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200F",
    },
  ],
  src: [
    { path: "./fonts/morabba/Morabba-UltraLight.ttf", weight: "200", style: "normal" },
    { path: "./fonts/morabba/Morabba-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/morabba/Morabba-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/morabba/Morabba-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/morabba/Morabba-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/morabba/Morabba-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/morabba/Morabba-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/morabba/Morabba-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/morabba/Morabba-Heavy.ttf", weight: "950", style: "normal" },
  ],
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
      className={`${geistSans.variable} ${morabba.variable} ${geistMono.variable} h-full bg-[#050508] antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050508] text-[#f2f0ec] font-sans [font-family:var(--font-geist-sans),Inter,ui-sans-serif,system-ui,sans-serif] [&_a]:text-inherit [&_a]:no-underline [&_a]:[-webkit-tap-highlight-color:transparent] [&_button]:[-webkit-tap-highlight-color:transparent]">
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
