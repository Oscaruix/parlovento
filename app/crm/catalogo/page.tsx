import { CatalogEditor } from "@/components/crm/catalog-editor"
import { PageHeader } from "@/components/crm/page-header"
import { createClient } from "@/lib/supabase/server"
export default async function CatalogPage(){const supabase=await createClient();const[packages,services]=await Promise.all([supabase.from("packages").select("id,name,description,price_cents,active,featured,inclusions").order("created_at"),supabase.from("services").select("id,name,description,price_cents,active,unit").order("created_at")]);return <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8"><PageHeader eyebrow="Oferta comercial" title="Catálogo" description="Edita los paquetes y servicios que usa el sitio y el cotizador."/><CatalogEditor packages={packages.data??[]} services={services.data??[]}/></div>}
