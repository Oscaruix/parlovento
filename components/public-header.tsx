"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const links = [{ href: "#espacios", label: "Espacios" }, { href: "#experiencias", label: "Experiencias" }, { href: "#paquetes", label: "Paquetes" }, { href: "#preguntas", label: "Preguntas" }]

export function PublicHeader({ onQuote }: { onQuote: () => void }) {
  return <header className="absolute inset-x-0 top-0 z-20 border-b border-primary-foreground/15">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
      <BrandMark light />
      <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
        {links.map((link) => <Link key={link.href} href={link.href} className="text-sm text-primary-foreground/85 transition-colors hover:text-primary-foreground">{link.label}</Link>)}
      </nav>
      <div className="flex items-center gap-2">
        <Button onClick={onQuote} className="hidden bg-accent text-accent-foreground hover:bg-accent/90 sm:inline-flex">Cotiza tu evento</Button>
        <Sheet>
          <SheetTrigger asChild><Button size="icon" variant="ghost" className="text-primary-foreground md:hidden"><Menu /><span className="sr-only">Abrir menú</span></Button></SheetTrigger>
          <SheetContent><SheetHeader><SheetTitle className="font-serif text-2xl">Parlovento</SheetTitle></SheetHeader><nav className="flex flex-col gap-5 px-5 py-8">{links.map((link) => <Link key={link.href} href={link.href} className="text-lg">{link.label}</Link>)}<Button onClick={onQuote}>Cotiza tu evento</Button></nav></SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
}
