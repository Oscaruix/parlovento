"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function EventForm() { const [open,setOpen]=useState(false); const [status,setStatus]=useState("hold"); const router=useRouter(); async function submit(formData: FormData){ const payload={...Object.fromEntries(formData),status}; const res=await fetch("/api/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); if(res.ok){toast.success("Fecha añadida");setOpen(false);router.refresh()} else toast.error("No se pudo guardar la fecha") }
return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button>Nueva fecha</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle className="font-serif text-3xl">Añadir a la agenda</DialogTitle><DialogDescription>Registra apartados, visitas, eventos confirmados o bloqueos.</DialogDescription></DialogHeader><form action={submit}><FieldGroup><Field><FieldLabel htmlFor="title">Título</FieldLabel><Input id="title" name="title" required /></Field><div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="eventDate">Fecha</FieldLabel><Input id="eventDate" name="eventDate" type="date" required /></Field><Field><FieldLabel>Estado</FieldLabel><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hold">Apartado</SelectItem><SelectItem value="visit">Visita</SelectItem><SelectItem value="confirmed">Confirmado</SelectItem><SelectItem value="blocked">Bloqueado</SelectItem></SelectContent></Select></Field></div><div className="grid gap-4 sm:grid-cols-2"><Field><FieldLabel htmlFor="startTime">Inicio</FieldLabel><Input id="startTime" name="startTime" type="time" /></Field><Field><FieldLabel htmlFor="endTime">Fin</FieldLabel><Input id="endTime" name="endTime" type="time" /></Field></div><Field><FieldLabel htmlFor="notes">Notas</FieldLabel><Textarea id="notes" name="notes" /></Field><Button>Guardar fecha</Button></FieldGroup></form></DialogContent></Dialog> }
