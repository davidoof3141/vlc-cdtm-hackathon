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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      tender_collaborators: {
        Row: {
          created_at: string
          id: string
          invited_by: string
          role: string
          tender_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by: string
          role?: string
          tender_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string
          role?: string
          tender_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_collaborators_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          agency: string | null
          ai_confidence: number | null
          budget: string | null
          budget_type: string | null
          capability: string | null
          client_name: string
          client_summary: string | null
          co_involve: string | null
          company_fit_score: number | null
          company_size: string | null
          compliance: string | null
          constraints: Json | null
          contact: string | null
          created_at: string
          deadline: string | null
          deliverables: Json | null
          delivery_window: string | null
          eligibility_items: Json | null
          evaluation_criteria: string | null
          evaluation_weights: Json | null
          executive_summary_ask: string | null
          gaps: Json | null
          goals: string | null
          id: string
          industry: string | null
          mandate: string | null
          owner: string | null
          past_win: string | null
          past_work: Json | null
          primary_dept: string | null
          primary_dept_rationale: string | null
          priorities: string | null
          priority: string | null
          procurement: string | null
          product_requirements: Json | null
          profitability: string | null
          progress: number | null
          project_name: string | null
          required_attachments: Json | null
          requirements: string | null
          risks: Json | null
          scope: string | null
          status: string
          strategic_context: string | null
          subtitle: string | null
          target_gm: string | null
          title: string
          updated_at: string
          user_id: string
          why_fits: Json | null
          win_themes: Json | null
        }
        Insert: {
          agency?: string | null
          ai_confidence?: number | null
          budget?: string | null
          budget_type?: string | null
          capability?: string | null
          client_name: string
          client_summary?: string | null
          co_involve?: string | null
          company_fit_score?: number | null
          company_size?: string | null
          compliance?: string | null
          constraints?: Json | null
          contact?: string | null
          created_at?: string
          deadline?: string | null
          deliverables?: Json | null
          delivery_window?: string | null
          eligibility_items?: Json | null
          evaluation_criteria?: string | null
          evaluation_weights?: Json | null
          executive_summary_ask?: string | null
          gaps?: Json | null
          goals?: string | null
          id?: string
          industry?: string | null
          mandate?: string | null
          owner?: string | null
          past_win?: string | null
          past_work?: Json | null
          primary_dept?: string | null
          primary_dept_rationale?: string | null
          priorities?: string | null
          priority?: string | null
          procurement?: string | null
          product_requirements?: Json | null
          profitability?: string | null
          progress?: number | null
          project_name?: string | null
          required_attachments?: Json | null
          requirements?: string | null
          risks?: Json | null
          scope?: string | null
          status?: string
          strategic_context?: string | null
          subtitle?: string | null
          target_gm?: string | null
          title: string
          updated_at?: string
          user_id: string
          why_fits?: Json | null
          win_themes?: Json | null
        }
        Update: {
          agency?: string | null
          ai_confidence?: number | null
          budget?: string | null
          budget_type?: string | null
          capability?: string | null
          client_name?: string
          client_summary?: string | null
          co_involve?: string | null
          company_fit_score?: number | null
          company_size?: string | null
          compliance?: string | null
          constraints?: Json | null
          contact?: string | null
          created_at?: string
          deadline?: string | null
          deliverables?: Json | null
          delivery_window?: string | null
          eligibility_items?: Json | null
          evaluation_criteria?: string | null
          evaluation_weights?: Json | null
          executive_summary_ask?: string | null
          gaps?: Json | null
          goals?: string | null
          id?: string
          industry?: string | null
          mandate?: string | null
          owner?: string | null
          past_win?: string | null
          past_work?: Json | null
          primary_dept?: string | null
          primary_dept_rationale?: string | null
          priorities?: string | null
          priority?: string | null
          procurement?: string | null
          product_requirements?: Json | null
          profitability?: string | null
          progress?: number | null
          project_name?: string | null
          required_attachments?: Json | null
          requirements?: string | null
          risks?: Json | null
          scope?: string | null
          status?: string
          strategic_context?: string | null
          subtitle?: string | null
          target_gm?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          why_fits?: Json | null
          win_themes?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
