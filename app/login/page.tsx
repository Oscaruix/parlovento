"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, LockKeyhole } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false)
  async function login(formData: FormData) {
    setPending(true); setError("")
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email: String(formData.get("email")), password: String(formData.get("password")) })
    if (authError) { setError(authError.message.toLowerCase().includes("confirm") ? "Confirma tu correo antes de entrar." : "Correo o contraseña incorrectos."); setPending(false); return }
    router.push("/crm"); router.refresh()
  }
  return <main className="grid min-h-svh lg:grid-cols-2"><section className="relative hidden overflow-hidden bg-primary lg:block"><div className="absolute inset-0 bg-[url('/images/parlovento-reception.png')] bg-cover bg-center opacity-50" /><div className="absolute inset-0 bg-primary/70" /><div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground"><BrandMark light /><div><p className="text-sm uppercase tracking-[0.18em] text-accent">Operación Parlovento</p><h1 className="mt-4 max-w-lg text-balance font-serif text-6xl font-semibold">Cada evento, claro desde el primer mensaje.</h1><p className="mt-5 max-w-md leading-relaxed text-primary-foreground/70">Solicitudes, agenda, cotizaciones y pagos en un solo lugar.</p></div><p className="text-sm text-primary-foreground/50">Acceso exclusivo para el equipo</p></div></section><section className="flex items-center justify-center p-5"><Card className="w-full max-w-md border-0 bg-transparent shadow-none"><CardHeader className="px-0"><span className="mb-5 flex size-11 items-center justify-center rounded-full bg-secondary"><LockKeyhole className="size-5 text-primary" /></span><CardTitle className="font-serif text-4xl">Bienvenido de vuelta</CardTitle><CardDescription>Ingresa con tu cuenta de propietario o equipo.</CardDescription></CardHeader><CardContent className="px-0"><form action={login}><FieldGroup><Field><FieldLabel htmlFor="email">Correo</FieldLabel><Input id="email" name="email" type="email" autoComplete="email" required /></Field><Field><FieldLabel htmlFor="password">Contraseña</FieldLabel><Input id="password" name="password" type="password" autoComplete="current-password" required /></Field>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button className="w-full" disabled={pending}>{pending && <LoaderCircle data-icon="inline-start" className="animate-spin" />}Entrar al CRM</Button></FieldGroup></form></CardContent></Card></section></main>
}
