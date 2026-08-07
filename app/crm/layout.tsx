import { redirect } from "next/navigation"
import { CrmShell } from "@/components/crm-shell"
import { createClient } from "@/lib/supabase/server"

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return <CrmShell email={user.email ?? "equipo@parlovento.mx"}>{children}</CrmShell>
}
