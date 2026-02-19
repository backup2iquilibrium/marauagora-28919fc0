export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ad_campaigns: {
        Row: {
          clicks: number
          client_name: string
          created_at: string
          ends_at: string | null
          id: string
          impressions: number
          notes: string | null
          owner_user_id: string | null
          space_id: string
          starts_at: string | null
          status: Database["public"]["Enums"]["ad_campaign_status"]
          title: string
          updated_at: string
        }
        Insert: {
          clicks?: number
          client_name: string
          created_at?: string
          ends_at?: string | null
          id?: string
          impressions?: number
          notes?: string | null
          owner_user_id?: string | null
          space_id: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["ad_campaign_status"]
          title: string
          updated_at?: string
        }
        Update: {
          clicks?: number
          client_name?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          impressions?: number
          notes?: string | null
          owner_user_id?: string | null
          space_id?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["ad_campaign_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_campaigns_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "ad_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_spaces: {
        Row: {
          created_at: string
          device_label: string
          id: string
          is_active: boolean
          monthly_price_cents: number | null
          name: string
          size_label: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_label: string
          id?: string
          is_active?: boolean
          monthly_price_cents?: number | null
          name: string
          size_label: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_label?: string
          id?: string
          is_active?: boolean
          monthly_price_cents?: number | null
          name?: string
          size_label?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      city_points: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          search_vector: unknown
          slug: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          search_vector?: unknown
          slug: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          search_vector?: unknown
          slug?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      classified_ad_media: {
        Row: {
          ad_id: string
          created_at: string
          height: number | null
          id: string
          kind: string
          media_url: string
          sort_order: number
          thumbnail_url: string | null
          width: number | null
        }
        Insert: {
          ad_id: string
          created_at?: string
          height?: number | null
          id?: string
          kind?: string
          media_url: string
          sort_order?: number
          thumbnail_url?: string | null
          width?: number | null
        }
        Update: {
          ad_id?: string
          created_at?: string
          height?: number | null
          id?: string
          kind?: string
          media_url?: string
          sort_order?: number
          thumbnail_url?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "classified_ad_media_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "classified_ads"
            referencedColumns: ["id"]
          },
        ]
      }
      classified_ads: {
        Row: {
          advertiser_email: string
          advertiser_name: string
          category_slug: string
          created_at: string
          id: string
          owner_user_id: string | null
          published_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          advertiser_email: string
          advertiser_name: string
          category_slug: string
          created_at?: string
          id?: string
          owner_user_id?: string | null
          published_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          advertiser_email?: string
          advertiser_name?: string
          category_slug?: string
          created_at?: string
          id?: string
          owner_user_id?: string | null
          published_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classified_ads_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "classified_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      classified_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      contact_message_rate_limits: {
        Row: {
          count: number
          id: string
          key: string
          updated_at: string
          window_start: string
        }
        Insert: {
          count?: number
          id?: string
          key: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          count?: number
          id?: string
          key?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      emergency_numbers: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_published: boolean
          label: string
          number: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_published?: boolean
          label: string
          number: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_published?: boolean
          label?: string
          number?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      event_submission_rate_limits: {
        Row: {
          count: number
          id: string
          key: string
          updated_at: string
          window_start: string
        }
        Insert: {
          count?: number
          id?: string
          key: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          count?: number
          id?: string
          key?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      event_submissions: {
        Row: {
          category: string | null
          city: string
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          is_free: boolean
          notes: string | null
          organizer_contact: string
          organizer_name: string
          starts_at: string
          status: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_free?: boolean
          notes?: string | null
          organizer_contact: string
          organizer_name: string
          starts_at: string
          status?: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_free?: boolean
          notes?: string | null
          organizer_contact?: string
          organizer_name?: string
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          city: string
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          image_url: string | null
          is_featured_week: boolean
          is_free: boolean
          search_vector: unknown
          slug: string
          starts_at: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_featured_week?: boolean
          is_free?: boolean
          search_vector?: unknown
          slug: string
          starts_at: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          category?: string | null
          city?: string
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_featured_week?: boolean
          is_free?: boolean
          search_vector?: unknown
          slug?: string
          starts_at?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      galleries: {
        Row: {
          category: string | null
          city: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          media_kind: string
          published_at: string
          slug: string
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          category?: string | null
          city?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          media_kind?: string
          published_at?: string
          slug: string
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          category?: string | null
          city?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          media_kind?: string
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          created_at: string
          duration_seconds: number | null
          gallery_id: string
          id: string
          kind: string
          media_url: string
          sort_order: number
          thumbnail_url: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          gallery_id: string
          id?: string
          kind?: string
          media_url: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          gallery_id?: string
          id?: string
          kind?: string
          media_url?: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      horoscopes: {
        Row: {
          content: string
          created_at: string
          for_date: string
          id: string
          is_published: boolean
          period: string
          sign_slug: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          for_date: string
          id?: string
          is_published?: boolean
          period?: string
          sign_slug: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          for_date?: string
          id?: string
          is_published?: boolean
          period?: string
          sign_slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          employment_type: string | null
          id: string
          location: string | null
          posted_at: string
          search_vector: unknown
          title: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          posted_at?: string
          search_vector?: unknown
          title: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          id?: string
          location?: string | null
          posted_at?: string
          search_vector?: unknown
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          body: string | null
          category_slug: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published_at: string
          search_vector: unknown
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category_slug?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          search_vector?: unknown
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category_slug?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published_at?: string
          search_vector?: unknown
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          display_name: string | null
          id: string
          is_verified: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          is_verified?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_verified?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      public_service_actions: {
        Row: {
          created_at: string
          href: string
          icon: string | null
          id: string
          label: string
          service_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          href: string
          icon?: string | null
          id?: string
          label: string
          service_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          href?: string
          icon?: string | null
          id?: string
          label?: string
          service_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_service_actions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "public_services"
            referencedColumns: ["id"]
          },
        ]
      }
      public_service_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      public_service_links: {
        Row: {
          created_at: string
          href: string
          icon: string | null
          id: string
          is_published: boolean
          label: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          icon?: string | null
          id?: string
          is_published?: boolean
          label: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          icon?: string | null
          id?: string
          is_published?: boolean
          label?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      public_services: {
        Row: {
          address: string | null
          category_slug: string | null
          created_at: string
          details: string | null
          hours_label: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          phone: string | null
          slug: string
          sort_order: number
          status_badge: string | null
          summary: string | null
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          address?: string | null
          category_slug?: string | null
          created_at?: string
          details?: string | null
          hours_label?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          phone?: string | null
          slug: string
          sort_order?: number
          status_badge?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          address?: string | null
          category_slug?: string | null
          created_at?: string
          details?: string | null
          hours_label?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          phone?: string | null
          slug?: string
          sort_order?: number
          status_badge?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_services_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "public_service_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zodiac_sign_profiles: {
        Row: {
          career: string | null
          created_at: string
          date_range: string | null
          health: string | null
          icon: string | null
          id: string
          is_published: boolean
          love: string | null
          overview: string | null
          sign_name: string
          sign_slug: string
          traits: Json
          updated_at: string
        }
        Insert: {
          career?: string | null
          created_at?: string
          date_range?: string | null
          health?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          love?: string | null
          overview?: string | null
          sign_name: string
          sign_slug: string
          traits?: Json
          updated_at?: string
        }
        Update: {
          career?: string | null
          created_at?: string
          date_range?: string | null
          health?: string | null
          icon?: string | null
          id?: string
          is_published?: boolean
          love?: string | null
          overview?: string | null
          sign_name?: string
          sign_slug?: string
          traits?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_portal: {
        Args: {
          category?: string
          page_offset?: number
          page_size?: number
          q: string
          sort?: string
        }
        Returns: Database["public"]["CompositeTypes"]["portal_search_result"][]
        SetofOptions: {
          from: "*"
          to: "portal_search_result"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      search_portal_counts: {
        Args: { category?: string; q: string }
        Returns: Json
      }
    }
    Enums: {
      ad_campaign_status: "draft" | "active" | "paused" | "ended"
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      portal_search_result: {
        item_type: string | null
        item_id: string | null
        title: string | null
        excerpt: string | null
        route: string | null
        published_at: string | null
        rank: number | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      ad_campaign_status: ["draft", "active", "paused", "ended"],
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
