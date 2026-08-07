"use client"

import { useState } from "react"
import { toast } from "sonner"
import { CalendarDays, Mail, Phone, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

type Lead = { id: string; status: string; event_type: string; event_date: string | null; guest_count: number | null; budget_cents: number | null; special_requests: string | null; created_at: string; customers: { name: string; phone: string; email: string | null } | { name: string; phone: string; email: string | null }[] | null }
const labels: Record<string,string> = { new:"Nueva", contacted:"Contactada", visit_scheduled:"Visita agendada", quoted:"Cotizada", won:"Ganada", lost:"Perdida" }
function customerOf(lead: Lead) { return Array.isArray(lead.customers) ? lead.customers[0] : lead.customers }

export function LeadTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  async function updateStatus(id: string, status: string) {
    const previous = leads; setLeads((rows) => rows.map((row) => row.id === id ? { ...row, status } : row))
    const response = await fetch(`/api/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    if (!response.ok) { setLeads(previous); toast.error("No se pudo actualizar") } else toast.success("Estado actualizado")
  }
  return <div className="overflow-hidden rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead>Contacto</TableHead><TableHead>Evento</TableHead><TableHead>Fecha</TableHead><TableHead>Invitados</TableHead><TableHead>Estado</TableHead><TableHead className="text-right">Detalle</TableHead></TableRow></TableHeader><TableBody>{leads.map((lead) => { const customer = customerOf(lead); return <TableRow key={lead.id}><TableCell><p className="font-medium">{customer?.name ?? "Sin nombre"}</p><p className="text-xs text-muted-foreground">{customer?.phone}</p></TableCell><TableCell>{lead.event_type}</TableCell><TableCell>{lead.event_date ? formatDate(lead.event_date+"T12:00:00") : "Por definir"}</TableCell><TableCell>{lead.guest_count ?? "—"}</TableCell><TableCell><Select value={lead.status} onValueChange={(value) => updateStatus(lead.id, value)}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(labels).map(([value,label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></TableCell><TableCell className="text-right"><Sheet><SheetTrigger asChild><Button variant="ghost" size="sm">Abrir</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle className="font-serif text-3xl">{customer?.name ?? "Solicitud"}</SheetTitle><SheetDescription>Recibida el {formatDate(lead.created_at)}</SheetDescription></SheetHeader><div className="flex flex-col gap-5 px-4"><Badge className="w-fit">{labels[lead.status]}</Badge><Detail icon={Phone} label="Teléfono" value={customer?.phone ?? "—"} /><Detail icon={Mail} label="Correo" value={customer?.email ?? "—"} /><Detail icon={CalendarDays} label="Evento" value={`${lead.event_type} · ${lead.event_date ? formatDate(lead.event_date+"T12:00:00") : "fecha por definir"}`} /><Detail icon={Users} label="Invitados" value={String(lead.guest_count ?? "Por definir")} />{lead.special_requests && <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Notas</p><p className="mt-2 text-sm leading-relaxed">{lead.special_requests}</p></div>}</div></SheetContent></Sheet></TableCell></TableRow> })}{!leads.length && <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Aún no hay solicitudes.</TableCell></TableRow>}</TableBody></Table></div>
}
function Detail({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) { return <div className="flex gap-3"><Icon className="mt-0.5 size-4 text-primary" /><div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm">{value}</p></div></div> }
