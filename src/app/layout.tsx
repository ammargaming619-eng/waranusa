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
        {/* Preload Gambar LCP Hero Responsif yang Selaras dengan Next.js SrcSet */}
        <link
          rel="preload"
          as="image"
          imageSrcSet="/_next/image?url=%2Fimages%2Findonesia-map-batik.png&w=360&q=75 360w, /_next/image?url=%2Fimages%2Findonesia-map-batik.png&w=414&q=75 414w, /_next/image?url=%2Fimages%2Findonesia-map-batik.png&w=640&q=75 640w, /_next/image?url=%2Fimages%2Findonesia-map-batik.png&w=1200&q=75 1200w"
          imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
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
