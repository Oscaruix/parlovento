"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowUp, MessageCircle, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const transport = new DefaultChatTransport({ api: "/api/chat" })

export function ChatAssistant({ onQuote }: { onQuote: () => void }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const { messages, sendMessage, status } = useChat({ transport })
  const busy = status === "submitted" || status === "streaming"
  return <>
    <div className={cn("fixed bottom-24 right-4 z-40 flex h-[32rem] w-[calc(100%-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl transition-all md:right-6", open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0")} aria-hidden={!open}>
      <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10"><Sparkles className="size-4" /></span><div><p className="font-medium">Asistente Parlovento</p><p className="text-xs text-primary-foreground/70">Disponibilidad y cotizaciones</p></div></div><Button size="icon" variant="ghost" onClick={() => setOpen(false)}><X /><span className="sr-only">Cerrar chat</span></Button></div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
        <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-muted p-3 text-sm leading-relaxed">Hola, soy el asistente de Parlovento. Puedo orientarte sobre capacidad, paquetes, fechas y ayudarte a preparar una solicitud.</div>
        {messages.map((message) => <div key={message.id} className={cn("max-w-[88%] rounded-2xl p-3 text-sm leading-relaxed", message.role === "user" ? "ml-auto rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted")}>{message.parts.map((part, index) => part.type === "text" ? <span key={index}>{part.text}</span> : null)}</div>)}
        {busy && <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-muted p-3 text-sm text-muted-foreground">Pensando…</div>}
      </div>
      <div className="border-t p-3"><form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); if (input.trim() && !busy) { sendMessage({ text: input }); setInput("") } }}><Input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Pregunta por tu evento…" disabled={busy} onKeyDown={(event) => { if (event.nativeEvent.isComposing || event.keyCode === 229) return }} /><Button size="icon" disabled={!input.trim() || busy}><ArrowUp /><span className="sr-only">Enviar mensaje</span></Button></form><button className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground" onClick={onQuote}>Prefiero dejar mis datos</button></div>
    </div>
    <Button onClick={() => setOpen(!open)} size="lg" className="fixed bottom-5 right-4 z-40 h-14 rounded-full bg-accent px-5 text-accent-foreground shadow-xl hover:bg-accent/90 md:right-6"><MessageCircle data-icon="inline-start" />{open ? "Cerrar" : "Hablemos"}</Button>
  </>
}
