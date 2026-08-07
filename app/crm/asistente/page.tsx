import { InternalAssistant } from "@/components/crm/internal-assistant"
import { PageHeader } from "@/components/crm/page-header"
export default function AssistantPage(){return <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8"><PageHeader eyebrow="Asistencia interna" title="Copiloto de operación" description="Consulta tu contexto comercial y prepara respuestas sin salir del CRM."/><InternalAssistant/></div>}
