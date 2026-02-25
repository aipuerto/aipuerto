export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          company: string | null
          phone: string | null
          whatsapp: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          company?: string | null
          phone?: string | null
          whatsapp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          company?: string | null
          phone?: string | null
          whatsapp?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          price: number
          stripe_price_id: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          price: number
          stripe_price_id?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          price?: number
          stripe_price_id?: string | null
          active?: boolean
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          service_id: string
          stripe_session_id: string | null
          stripe_payment_id: string | null
          status: 'pending' | 'paid' | 'refunded'
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          stripe_session_id?: string | null
          stripe_payment_id?: string | null
          status?: 'pending' | 'paid' | 'refunded'
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          stripe_session_id?: string | null
          stripe_payment_id?: string | null
          status?: 'pending' | 'paid' | 'refunded'
          paid_at?: string | null
          created_at?: string
        }
      }
      service_configs: {
        Row: {
          id: string
          user_id: string
          purchase_id: string
          service_id: string
          config_data: Json
          n8n_webhook_url: string | null
          is_active: boolean
          setup_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          purchase_id: string
          service_id: string
          config_data?: Json
          n8n_webhook_url?: string | null
          is_active?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          purchase_id?: string
          service_id?: string
          config_data?: Json
          n8n_webhook_url?: string | null
          is_active?: boolean
          setup_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          user_name: string
          company: string | null
          content: string
          rating: number | null
          avatar_url: string | null
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_name: string
          company?: string | null
          content: string
          rating?: number | null
          avatar_url?: string | null
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_name?: string
          company?: string | null
          content?: string
          rating?: number | null
          avatar_url?: string | null
          approved?: boolean
          created_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          replied: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          replied?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          replied?: boolean
          created_at?: string
        }
      }
    }
  }
}
