"use client"

import { useState } from "react"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function InquiryForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [pending, setPending] = useState(false)
  async function submit(formData: FormData) {
    setPending(true)
    try {
      const payload = Object.fromEntries(formData)
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!response.ok) throw new Error()
      toast.success("Recibimos tu solicitud", { description: "El equipo de Parlovento te contactará pronto." })
      onOpenChange(false)
    } catch { toast.error("No pudimos enviar la solicitud", { description: "Intenta nuevamente en unos minutos." }) }
    finally { setPending(false) }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle className="font-serif text-3xl">Cuéntanos qué quieres celebrar</DialogTitle><DialogDescription>Compártenos los datos iniciales. La propuesta y precios se personalizan para cada evento.</DialogDescription></DialogHeader>
    <form action={submit}><FieldGroup>
      <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="name">Nombre</FieldLabel><Input id="name" name="name" required minLength={2} /></Field><Field><FieldLabel htmlFor="phone">Teléfono</FieldLabel><Input id="phone" name="phone" type="tel" required minLength={8} /></Field></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="eventType">Tipo de evento</FieldLabel><Input id="eventType" name="eventType" placeholder="Boda, cumpleaños…" required /></Field><Field><FieldLabel htmlFor="eventDate">Fecha tentativa</FieldLabel><Input id="eventDate" name="eventDate" type="date" /></Field></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="guestCount">Invitados</FieldLabel><Input id="guestCount" name="guestCount" type="number" min="1" max="450" /></Field><Field><FieldLabel htmlFor="email">Correo</FieldLabel><Input id="email" name="email" type="email" /></Field></div>
      <Field><FieldLabel htmlFor="message">¿Qué tienes en mente?</FieldLabel><Textarea id="message" name="message" rows={3} /></Field>
      <Button disabled={pending} className="w-full">{pending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}Enviar solicitud</Button>
    </FieldGroup></form>
  </DialogContent></Dialog>
}
