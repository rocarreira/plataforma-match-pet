import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          bio: string | null
          avatar_url: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          bio?: string | null
          avatar_url?: string | null
          location?: string | null
          created_at?: string
        }
      }
      animals: {
        Row: {
          id: string
          user_id: string
          name: string
          species: string
          breed: string | null
          age: number | null
          location: string | null
          behavior: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          species: string
          breed?: string | null
          age?: number | null
          location?: string | null
          behavior?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          species?: string
          breed?: string | null
          age?: number | null
          location?: string | null
          behavior?: string | null
          photo_url?: string | null
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user_id: string
          animal_id: string
          liked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          animal_id: string
          liked: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          animal_id?: string
          liked?: boolean
          created_at?: string
        }
      }
    }
  }
}
