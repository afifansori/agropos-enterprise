import type { Metadata } from "next"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"

export const metadata: Metadata = {
  title: "AGROPOS — POS, Inventory & Supplier Portal Toko Obat Pertanian",
  description: "Sistem Multi-Organization, Multi-Branch POS & Inventory Management FEFO khusus toko obat-obatan pertanian.",
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
      </body>
    </html>
  )
}
