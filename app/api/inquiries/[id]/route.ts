import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const schema = z.object({ status: z.enum(["new","contacted","visit_scheduled","quoted","won","lost"]) })
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "No autorizado" }, { status: 401 })
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return Response.json({ error: "Inválido" }, { status: 400 })
  const { id } = await params
  const { error } = await supabase.from("inquiries").update({ status: parsed.data.status }).eq("id", id)
  if (error) return Response.json({ error: "No se pudo actualizar" }, { status: 500 })
  await supabase.from("activities").insert({ inquiry_id: id, actor_id: user.id, type: "status_changed", description: `Estado actualizado a ${parsed.data.status}` })
  return Response.json({ ok: true })
}
