import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const store = await cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookieOptions: { secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll: () => store.getAll(),
      setAll(items) { try { items.forEach(({ name, value, options }) => store.set(name, value, options)) } catch {} },
    },
  })
}
