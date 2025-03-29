export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          avatar_url: string | null
          user_type: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          avatar_url?: string | null
          user_type: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          avatar_url?: string | null
          user_type?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          location: string
          start_date: string
          end_date: string
          image_url: string | null
          organizer_id: string
          created_at: string
          updated_at: string | null
          status: string
          category: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          location: string
          start_date: string
          end_date: string
          image_url?: string | null
          organizer_id: string
          created_at?: string
          updated_at?: string | null
          status?: string
          category: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          start_date?: string
          end_date?: string
          image_url?: string | null
          organizer_id?: string
          created_at?: string
          updated_at?: string | null
          status?: string
          category?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id: string
          event_id: string
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          status?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          read: boolean
          created_at: string
          updated_at: string | null
          type: string
          related_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          read?: boolean
          created_at?: string
          updated_at?: string | null
          type: string
          related_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          read?: boolean
          created_at?: string
          updated_at?: string | null
          type?: string
          related_id?: string | null
        }
      }
    }
  }
}

