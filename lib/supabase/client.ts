import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a singleton to avoid multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const createClientClient = () => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Add the missing export
export const getClientSupabase = createClientClient

