import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"

export const metadata: Metadata = {
  title: "AgroPOS - Sistem Kasir Toko Pertanian",
  description: "Sistem POS & manajemen toko obat pertanian dan saprotan",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgroPOS",
  },
}

export const viewport: Viewport = {
  themeColor: "#166534",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#F0FDF4] text-[#1E293B] antialiased">
        <QueryProvider>{children}</QueryProvider>
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}</Script>
      </body>
    </html>
  )
}
