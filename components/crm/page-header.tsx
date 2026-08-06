export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <p className="text-sm text-primary">{eyebrow}</p>}<h1 className="text-balance font-serif text-4xl font-semibold">{title}</h1><p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p></div>{action}</div>
}
