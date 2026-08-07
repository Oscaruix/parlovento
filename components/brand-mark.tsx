import Link from "next/link"
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

export function BrandMark({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return <Link href="/" className={cn("inline-flex items-center gap-3", light ? "text-primary-foreground" : "text-foreground")} aria-label="Parlovento, inicio">
    <span className={cn("flex size-9 items-center justify-center rounded-full border", light ? "border-primary-foreground/30" : "border-primary/25")}><Leaf className="size-4" aria-hidden="true" /></span>
    {!compact && <span className="font-serif text-2xl font-semibold tracking-wide">Parlovento</span>}
  </Link>
}
