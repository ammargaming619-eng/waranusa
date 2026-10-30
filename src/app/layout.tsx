import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientWidgets } from "@/components/shared/client-widgets";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FCF8EC",
};

export const metadata: Metadata = {
  title: {
    default: "WaraNusa — Platform Eksplorasi & Pelestarian Budaya Indonesia",
    template: "%s · WaraNusa",
  },
  description:
    "WaraNusa adalah platform digital untuk eksplorasi, pembelajaran, dokumentasi, dan pelestarian warisan budaya Indonesia melalui peta interaktif, katalog budaya bersumber, visualisasi 3D, dan instrumen musik virtual.",
  keywords: ["budaya Indonesia", "rumah adat", "batik", "gamelan", "warisan budaya", "museum digital"],
  icons: { icon: "/images/brand/waranusa-logo.png" },
  openGraph: {
    title: "WaraNusa — Kenali Akar, Jelajahi Budaya",
    description: "Platform eksplorasi & pelestarian budaya Indonesia dengan peta interaktif, katalog bersumber, 3D, dan instrumen virtual.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Responsive LCP Image Preload untuk Mobile 4G & Desktop (Sesuai output srcset Next.js) */}
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fimages%2Findonesia-map-batik.png&w=360&q=75"
          media="(max-width: 380px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fimages%2Findonesia-map-batik.png&w=640&q=75"
          media="(min-width: 381px) and (max-width: 640px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fimages%2Findonesia-map-batik.png&w=1200&q=75"
          media="(min-width: 641px)"
          fetchPriority="high"
        />
      </head>
      <body suppressHydrationWarning className={`${jakarta.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}>
        {children}
        <ClientWidgets />
      </body>
    </html>
  );
}
