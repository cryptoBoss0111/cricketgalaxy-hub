export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          category: string
          content: string
          content_blocks: Json | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          published: boolean | null
          published_at: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          content_blocks?: Json | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          published_at?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          content_blocks?: Json | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          published_at?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fan_polls: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          options: Json
          question: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options: Json
          question: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fantasy_picks: {
        Row: {
          created_at: string
          form: string
          id: string
          match: string
          match_id: string | null
          player_name: string
          points_prediction: number
          reason: string
          role: string
          team: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          form: string
          id?: string
          match: string
          match_id?: string | null
          player_name: string
          points_prediction: number
          reason: string
          role: string
          team: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          form?: string
          id?: string
          match?: string
          match_id?: string | null
          player_name?: string
          points_prediction?: number
          reason?: string
          role?: string
          team?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fantasy_picks_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "upcoming_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_slider: {
        Row: {
          article_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number
          updated_at: string | null
        }
        Insert: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index: number
          updated_at?: string | null
        }
        Update: {
          article_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hero_slider_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          created_at: string
          id: string
          original_file_name: string
          size: number | null
          stored_file_name: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          original_file_name: string
          size?: number | null
          stored_file_name: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          original_file_name?: string
          size?: number | null
          stored_file_name?: string
          url?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          id: string
          label: string
          order_index: number
          path: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          order_index: number
          path: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          order_index?: number
          path?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      player_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          image: string | null
          name: string
          role: string
          stats: Json
          team: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          image?: string | null
          name: string
          role: string
          stats?: Json
          team: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          role?: string
          stats?: Json
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          option_id: string
          poll_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          option_id: string
          poll_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          option_id?: string
          poll_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "fan_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      top_stories: {
        Row: {
          article_id: string
          created_at: string
          featured: boolean
          id: string
          order_index: number
          updated_at: string
        }
        Insert: {
          article_id: string
          created_at?: string
          featured?: boolean
          id?: string
          order_index: number
          updated_at?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          featured?: boolean
          id?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "top_stories_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      upcoming_matches: {
        Row: {
          competition: string
          created_at: string
          id: string
          image: string | null
          match_time: string
          match_type: string
          team1: string
          team2: string
          updated_at: string
          venue: string
        }
        Insert: {
          competition: string
          created_at?: string
          id?: string
          image?: string | null
          match_time: string
          match_type: string
          team1: string
          team2: string
          updated_at?: string
          venue: string
        }
        Update: {
          competition?: string
          created_at?: string
          id?: string
          image?: string | null
          match_time?: string
          match_type?: string
          team1?: string
          team2?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_admin: {
        Args: {
          admin_username: string
          admin_password: string
        }
        Returns: string
      }
      update_top_stories: {
        Args: {
          stories_data: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
