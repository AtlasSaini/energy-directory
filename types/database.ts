export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: string
          company_name: string
          slug: string
          description: string | null
          province: string | null
          city: string | null
          address: string | null
          website: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          banner_url: string | null
          photos: string[] | null
          video_url: string | null
          tier: 'free' | 'featured' | 'premium'
          verified: boolean
          active: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          subscription_expires_at: string | null
          user_id: string | null
          views: number
          featured_until: string | null
          data_status: 'current' | 'stale' | 'review_needed' | 'dissolved' | null
          health_flag: 'dead_link' | 'domain_gone' | 'domain_parked' | 'domain_redirected' | 'timeout' | 'http_error' | 'news_bankruptcy' | 'registry_dissolved' | null
          last_verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['vendors']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['vendors']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      vendor_categories: {
        Row: {
          vendor_id: string
          category_id: string
        }
        Insert: Database['public']['Tables']['vendor_categories']['Row']
        Update: Partial<Database['public']['Tables']['vendor_categories']['Row']>
      }
      reviews: {
        Row: {
          id: string
          vendor_id: string
          reviewer_name: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      leads: {
        Row: {
          id: string
          vendor_id: string
          name: string
          email: string
          phone: string | null
          message: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      stripe_events: {
        Row: {
          id: string
          stripe_event_id: string
          type: string
          data: Json
          processed: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['stripe_events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['stripe_events']['Insert']>
      }
      rfq_requests: {
        Row: {
          id: string
          vendor_id: string
          buyer_name: string
          buyer_company: string | null
          buyer_email: string
          buyer_phone: string | null
          service_description: string
          province: string | null
          timeline: string | null
          message: string | null
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['rfq_requests']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['rfq_requests']['Insert']>
      }
    }
  }
}

export type Vendor = Database['public']['Tables']['vendors']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type RFQRequest = Database['public']['Tables']['rfq_requests']['Row']
