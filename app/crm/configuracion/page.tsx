import { PageHeader } from "@/components/crm/page-header"
import { SettingsForm } from "@/components/crm/settings-form"
import { createClient } from "@/lib/supabase/server"
export default async function SettingsPage(){const supabase=await createClient();const{data}=await supabase.from("settings").select("value").eq("key","business").maybeSingle();return <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8"><PageHeader eyebrow="Administración" title="Configuración" description="Mantén actualizados los datos base que utiliza el sistema."/><SettingsForm business={(data?.value as Record<string,string|number|boolean>)??{name:"Parlovento",capacity:450,address:"México"}}/></div>}
