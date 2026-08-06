import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage } from "ai"

export const maxDuration = 30
export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json()
  if (!Array.isArray(messages) || messages.length > 30) return Response.json({ error: "Solicitud inválida" }, { status: 400 })
  const result = streamText({
    model: "openai/o4-mini",
    instructions: `Eres el asistente web de Parlovento, un salón jardín para eventos en México. Responde siempre en español mexicano, cálido y profesional. Datos confirmados: capacidad máxima 450 personas; espacios de jardín y palapa; paquetes demo Esencial Jardín, Noche Parlovento y Gran Celebración; los precios son personalizados y nunca debes inventarlos. No afirmes que una fecha está libre porque no tienes acceso fiable a la agenda en este chat. Invita a dejar una solicitud con nombre, teléfono, tipo de evento, fecha tentativa e invitados. Sé breve, útil y transparente.`,
    messages: await convertToModelMessages(messages),
  })
  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })
}
