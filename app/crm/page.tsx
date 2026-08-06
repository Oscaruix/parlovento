import Link from "next/link"
import { ArrowRight, CalendarClock, CircleDollarSign, MessageSquareText, TrendingUp, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0,10)
  const [inquiries, customers, events, quotes] = await Promise.all([
    supabase.from("inquiries").select("id,status,event_type,event_date,created_at,customers(name)").order("created_at", { ascending: false }).limit(5),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("venue_events").select("id,title,event_date,status").gte("event_date", today).order("event_date").limit(4),
    supabase.from("quotes").select("id,status,total_cents"),
  ])
  const leadRows = inquiries.data ?? []
  const eventRows = events.data ?? []
  const quoteRows = quotes.data ?? []
  const pipeline = quoteRows.reduce((sum, item) => sum + (item.total_cents ?? 0), 0)
  return <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-muted-foreground">Panorama del negocio</p><h1 className="font-serif text-4xl font-semibold">Buenos días, Parlovento.</h1></div><Button asChild><Link href="/crm/solicitudes">Ver solicitudes<ArrowRight data-icon="inline-end" /></Link></Button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={MessageSquareText} label="Solicitudes nuevas" value={String(leadRows.filter((row) => row.status === "new").length)} note="Pendientes de contacto" /><Metric icon={CalendarClock} label="Próximos eventos" value={String(eventRows.length)} note="En agenda" /><Metric icon={Users} label="Clientes" value={String(customers.count ?? 0)} note="Base total" /><Metric icon={CircleDollarSign} label="Cotizado" value={pipeline ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(pipeline/100) : "$0"} note="Pipeline actual" /></div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]"><Card><CardHeader className="flex-row items-center justify-between"><div><CardTitle>Solicitudes recientes</CardTitle><CardDescription>Conversaciones que requieren seguimiento.</CardDescription></div><Badge variant="secondary">{leadRows.length} activas</Badge></CardHeader><CardContent className="flex flex-col gap-1">{leadRows.length ? leadRows.map((lead) => <Link key={lead.id} href="/crm/solicitudes" className="flex items-center justify-between rounded-lg p-3 hover:bg-muted"><div><p className="font-medium">{Array.isArray(lead.customers) ? lead.customers[0]?.name : (lead.customers as { name?: string } | null)?.name ?? "Nuevo contacto"}</p><p className="text-sm text-muted-foreground">{lead.event_type} · {lead.event_date ? formatDate(lead.event_date) : "Sin fecha"}</p></div><Status value={lead.status} /></Link>) : <Empty text="Las nuevas solicitudes aparecerán aquí." />}</CardContent></Card><Card><CardHeader><CardTitle>Próximas fechas</CardTitle><CardDescription>Agenda interna del salón.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">{eventRows.length ? eventRows.map((event) => <div key={event.id} className="flex items-center gap-3"><div className="flex size-11 flex-col items-center justify-center rounded-lg bg-secondary text-primary"><span className="text-xs uppercase">{new Date(event.event_date+"T12:00:00").toLocaleDateString("es-MX", { month: "short" })}</span><span className="font-semibold leading-none">{new Date(event.event_date+"T12:00:00").getDate()}</span></div><div className="min-w-0"><p className="truncate text-sm font-medium">{event.title}</p><p className="text-xs text-muted-foreground">{event.status}</p></div></div>) : <Empty text="No hay eventos próximos." />}</CardContent></Card></div>
    <Card><CardHeader><CardTitle>Conversión comercial</CardTitle><CardDescription>Progreso de solicitudes hacia eventos confirmados.</CardDescription></CardHeader><CardContent><div className="grid gap-6 md:grid-cols-3"><Pipeline label="Contactadas" value={leadRows.filter((row) => row.status !== "new").length} total={Math.max(leadRows.length,1)} /><Pipeline label="Cotizadas" value={leadRows.filter((row) => row.status === "quoted" || row.status === "won").length} total={Math.max(leadRows.length,1)} /><Pipeline label="Ganadas" value={leadRows.filter((row) => row.status === "won").length} total={Math.max(leadRows.length,1)} /></div></CardContent></Card>
  </div>
}
function Metric({ icon: Icon, label, value, note }: { icon: typeof TrendingUp; label: string; value: string; note: string }) { return <Card><CardContent className="flex items-start justify-between p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-serif text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div><span className="flex size-9 items-center justify-center rounded-lg bg-secondary"><Icon className="size-4 text-primary" /></span></CardContent></Card> }
function Status({ value }: { value: string }) { const labels: Record<string,string> = { new:"Nueva", contacted:"Contactada", visit_scheduled:"Visita", quoted:"Cotizada", won:"Ganada", lost:"Perdida" }; return <Badge variant={value === "new" ? "default" : "secondary"}>{labels[value] ?? value}</Badge> }
function Empty({ text }: { text: string }) { return <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">{text}</div> }
function Pipeline({ label, value, total }: { label: string; value: number; total: number }) { const percentage = Math.round((value/total)*100); return <div><div className="mb-2 flex justify-between text-sm"><span>{label}</span><span className="text-muted-foreground">{percentage}%</span></div><Progress value={percentage} /></div> }
