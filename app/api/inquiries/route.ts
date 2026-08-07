import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const schema = z.object({
  name: z.string().trim().min(2).max(120), phone: z.string().trim().min(8).max(30), email: z.string().trim().email().optional().or(z.literal("")),
  eventType: z.string().trim().min(2).max(80), eventDate: z.string().optional(), guestCount: z.coerce.number().int().min(1).max(450).optional().or(z.literal("")), message: z.string().trim().max(1500).optional(),
})

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json())
  if (!parsed.success) return Response.json({ error: "Datos inválidos" }, { status: 400 })
  const input = parsed.data
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: customer, error: customerError } = await supabase.from("customers").insert({ name: input.name, phone: input.phone, email: input.email || null }).select("id").single()
  if (customerError) return Response.json({ error: "No se pudo guardar" }, { status: 503 })
  const { error } = await supabase.from("inquiries").insert({ customer_id: customer.id, event_type: input.eventType, event_date: input.eventDate || null, guest_count: input.guestCount || null, special_requests: input.message || null, source: "web" })
  if (error) return Response.json({ error: "No se pudo guardar" }, { status: 503 })
  return Response.json({ ok: true }, { status: 201 })
}
