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

async function loadPublicContent() {
  const supabase = await createClient()
  return Promise.all([
    supabase.from("packages").select("id,name,description,featured,inclusions").eq("active", true).order("featured", { ascending: false }),
    supabase.from("faqs").select("id,question,answer").eq("active", true).order("sort_order"),
  ])
}

export default async function HomePage() {
  let packages = fallbackPackages
  let faqs = fallbackFaqs

  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Public content request timed out")), 1200),
    )
    const [packageResult, faqResult] = await Promise.race([loadPublicContent(), timeout])
    if (packageResult.data?.length) packages = packageResult.data as PublicPackage[]
    if (faqResult.data?.length) faqs = faqResult.data as PublicFaq[]
  } catch {
    // Keep the launch-ready catalog visible while the connected database is unavailable.
  }

  return <PublicHome packages={packages} faqs={faqs} />
}
