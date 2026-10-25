import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

// Dynamic import untuk floating widget agar tidak membebani First Contentful Paint & bundle awal
const AccessibilityWidget = dynamic(
  () => import("@/components/shared/accessibility-widget").then((m) => m.AccessibilityWidget),
  { ssr: false }
);

const UnifiedAssistantWidget = dynamic(
  () => import("@/components/shared/unified-assistant-widget").then((m) => m.UnifiedAssistantWidget),
  { ssr: false }
);

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        {/* Preload gambar peta batik LCP (Largest Contentful Paint) agar tampil instan */}
        <link
          rel="preload"
          as="image"
          href="/images/indonesia-map-batik.png?v=7"
          type="image/png"
          // @ts-expect-error fetchpriority is standard HTML5 attribute
          fetchpriority="high"
        />
      </head>
      <body suppressHydrationWarning className={`${jakarta.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}>
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors closeButton />
        <AccessibilityWidget />
        <UnifiedAssistantWidget />
      </body>
    </html>
  );
}
