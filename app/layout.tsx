import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", weight: ["500", "600", "700"] })

export const metadata: Metadata = {
  title: { default: "Parlovento | Salón de eventos", template: "%s | Parlovento" },
  description: "Un jardín para celebrar lo que importa. Conoce Parlovento, consulta disponibilidad y solicita una cotización personalizada.",
  metadataBase: new URL("https://parlovento.vercel.app"),
}

export const viewport: Viewport = { themeColor: "#18231f", width: "device-width", initialScale: 1, userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" className={`bg-background ${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">{children}<Toaster richColors position="top-right" /></body>
    </html>
  )
}
