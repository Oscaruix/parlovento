import { PageHeader } from "@/components/crm/page-header"
import { LeadTable } from "@/components/crm/lead-table"
import { createClient } from "@/lib/supabase/server"

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("inquiries").select("id,status,event_type,event_date,guest_count,budget_cents,special_requests,created_at,customers(name,phone,email)").order("created_at", { ascending: false })
  return <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8"><PageHeader eyebrow="Pipeline comercial" title="Solicitudes" description="Califica cada contacto, agenda visitas y acompáñalo hasta la confirmación." /><LeadTable initialLeads={(data ?? []) as never[]} /></div>
}
