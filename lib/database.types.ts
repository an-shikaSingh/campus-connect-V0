export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          user_type: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          user_type?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          user_type?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          date: string
          time: string
          location: string
          description: string
          category: string
          image: string | null
          organizer: string
          max_attendees: number
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          date: string
          time: string
          location: string
          description: string
          category: string
          image?: string | null
          organizer: string
          max_attendees: number
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          date?: string
          time?: string
          location?: string
          description?: string
          category?: string
          image?: string | null
          organizer?: string
          max_attendees?: number
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      registrations: {
        Row: {
          id: string
          event_id: string
          user_id: string
          status: string
          created_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          status?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          status?: string
          created_at?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          read: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          read?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          read?: boolean
          created_at?: string | null
        }
      }
    }
  }
}

