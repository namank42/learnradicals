import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://learnradicals.com"),
  title: "Learn Radicals — The 214 Building Blocks of Chinese",
  description:
    "Chinese isn't 50,000 random symbols. It's 214 building blocks called radicals. The complete visual guide to all 214 Kangxi radicals.",
  keywords: [
    "Chinese radicals",
    "Kangxi radicals",
    "learn Chinese characters",
    "Chinese building blocks",
    "radical guide",
    "learn Chinese",
    "Chinese writing system",
    "HSK radicals",
    "Chinese character components",
    "visual Chinese guide",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Learn Radicals — The 214 Building Blocks of Chinese",
    description:
      "Chinese isn't 50,000 random symbols. It's 214 building blocks called radicals. The complete visual guide with 1,200+ example characters.",
    siteName: "Learn Radicals",
    type: "website",
    url: "/",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Learn Radicals — The 214 Building Blocks of Chinese",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Radicals — The 214 Building Blocks of Chinese",
    description:
      "Chinese isn't 50,000 random symbols. It's 214 building blocks called radicals. The complete visual guide with 1,200+ example characters.",
    images: ["/og-image.png"],
  },
  other: {
    "theme-color": "#faf8f4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/noto-serif-sc-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
