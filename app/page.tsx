import { PublicHome, type PublicFaq, type PublicPackage } from "@/components/public-home"
import { createClient } from "@/lib/supabase/server"

const fallbackPackages: PublicPackage[] = [
  { id: "essential", name: "Esencial Jardín", description: "Una base flexible para celebraciones íntimas y eventos de día.", featured: false, inclusions: ["Uso del jardín", "Mobiliario base", "Coordinación de acceso"] },
  { id: "night", name: "Noche Parlovento", description: "La experiencia completa de jardín y palapa iluminada.", featured: true, inclusions: ["Jardín y palapa", "Iluminación ambiental", "Mobiliario base", "Coordinación del recinto"] },
  { id: "grand", name: "Gran Celebración", description: "Espacios completos para eventos de mayor formato.", featured: false, inclusions: ["Exclusividad del recinto", "Montaje extendido", "Área de ceremonia"] },
]
const fallbackFaqs: PublicFaq[] = [
  { id: "capacity", question: "¿Cuál es la capacidad del salón?", answer: "Parlovento recibe eventos de hasta 450 personas, según el tipo de montaje." },
  { id: "visit", question: "¿Puedo agendar una visita?", answer: "Sí. Comparte tu fecha preferida y el equipo te contactará para coordinarla." },
  { id: "prices", question: "¿Los precios publicados son definitivos?", answer: "No. Cada cotización se personaliza según fecha, invitados y servicios." },
  { id: "hold", question: "¿Cómo aparto una fecha?", answer: "La fecha se confirma una vez aceptada la cotización y registrado el anticipo acordado." },
]

export default async function HomePage() {
  let packages = fallbackPackages
  let faqs = fallbackFaqs
  try {
    const supabase = await createClient()
    const [packageResult, faqResult] = await Promise.all([
      supabase.from("packages").select("id,name,description,featured,inclusions").eq("active", true).order("featured", { ascending: false }),
      supabase.from("faqs").select("id,question,answer").eq("active", true).order("sort_order"),
    ])
    if (packageResult.data?.length) packages = packageResult.data as PublicPackage[]
    if (faqResult.data?.length) faqs = faqResult.data as PublicFaq[]
  } catch {}
  return <PublicHome packages={packages} faqs={faqs} />
}
