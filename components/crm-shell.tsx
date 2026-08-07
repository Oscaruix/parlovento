"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, BookOpen, CalendarDays, FileText, LayoutDashboard, LogOut, MessageSquareText, Settings, Sparkles, Users } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const groups = [
  { label: "Operación", items: [{ href: "/crm", label: "Resumen", icon: LayoutDashboard }, { href: "/crm/solicitudes", label: "Solicitudes", icon: MessageSquareText }, { href: "/crm/calendario", label: "Calendario", icon: CalendarDays }, { href: "/crm/cotizaciones", label: "Cotizaciones", icon: FileText }, { href: "/crm/clientes", label: "Clientes", icon: Users }, { href: "/crm/asistente", label: "Copiloto IA", icon: Sparkles }] },
  { label: "Negocio", items: [{ href: "/crm/catalogo", label: "Catálogo", icon: BookOpen }, { href: "/crm/reportes", label: "Reportes", icon: BarChart3 }, { href: "/crm/configuracion", label: "Configuración", icon: Settings }] },
]
export function CrmShell({ children, email }: { children: React.ReactNode; email: string }) {
  const path = usePathname(); const router = useRouter()
  async function signOut() { await createClient().auth.signOut(); router.push("/login"); router.refresh() }
  return <SidebarProvider><Sidebar collapsible="icon"><SidebarHeader className="p-4"><BrandMark light /></SidebarHeader><SidebarContent>{groups.map((group) => <SidebarGroup key={group.label}><SidebarGroupLabel>{group.label}</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{group.items.map((item) => <SidebarMenuItem key={item.href}><SidebarMenuButton asChild isActive={path === item.href} tooltip={item.label}><Link href={item.href}><item.icon /><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup>)}</SidebarContent><SidebarFooter><SidebarMenu><SidebarMenuItem><SidebarMenuButton className="h-auto py-2"><Avatar className="size-8"><AvatarFallback>PV</AvatarFallback></Avatar><span className="min-w-0"><span className="block truncate text-xs">{email}</span><span className="block text-xs text-sidebar-foreground/55">Propietario</span></span></SidebarMenuButton></SidebarMenuItem><SidebarMenuItem><SidebarMenuButton onClick={signOut}><LogOut /><span>Cerrar sesión</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarFooter></Sidebar><SidebarInset><header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:px-6"><div className="flex items-center gap-3"><SidebarTrigger /><div><p className="text-xs text-muted-foreground">Parlovento CRM</p><p className="text-sm font-medium">{titleForPath(path)}</p></div></div><span className="hidden text-xs text-muted-foreground sm:block">Datos en tiempo real</span></header>{children}</SidebarInset></SidebarProvider>
}
function titleForPath(path: string) { const item = groups.flatMap((group) => group.items).find((entry) => entry.href === path); return item?.label ?? "Operación" }
