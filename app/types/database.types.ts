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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      grupos_muestreo: {
        Row: {
          codigo_plan_muestreo: string | null
          nivel_inspeccion: string
          tamano_lote_desde: number
          tamano_lote_hasta: number | null
          tipo_de_inspeccion: string | null
        }
        Insert: {
          codigo_plan_muestreo?: string | null
          nivel_inspeccion: string
          tamano_lote_desde: number
          tamano_lote_hasta?: number | null
          tipo_de_inspeccion?: string | null
        }
        Update: {
          codigo_plan_muestreo?: string | null
          nivel_inspeccion?: string
          tamano_lote_desde?: number
          tamano_lote_hasta?: number | null
          tipo_de_inspeccion?: string | null
        }
        Relationships: []
      }
      grupos_planes: {
        Row: {
          aql: string | null
          codigo: string | null
          nivel_inspeccion: string | null
          tamano_lote_desde: number | null
        }
        Insert: {
          aql?: string | null
          codigo?: string | null
          nivel_inspeccion?: string | null
          tamano_lote_desde?: number | null
        }
        Update: {
          aql?: string | null
          codigo?: string | null
          nivel_inspeccion?: string | null
          tamano_lote_desde?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grupos_planes_codigo_aql_fkey"
            columns: ["codigo", "aql"]
            isOneToOne: false
            referencedRelation: "planes_de_muestreo"
            referencedColumns: ["codigo", "aql"]
          },
          {
            foreignKeyName: "grupos_planes_tamano_lote_desde_nivel_inspeccion_fkey"
            columns: ["tamano_lote_desde", "nivel_inspeccion"]
            isOneToOne: false
            referencedRelation: "grupos_muestreo"
            referencedColumns: ["tamano_lote_desde", "nivel_inspeccion"]
          },
        ]
      }
      orders: {
        Row: {
          cantidad_embalajes: number
          cliente: string
          codigo_producto: string
          created_at: string
          fecha_fabricacion: string
          id: string
          inspector_calidad: string
          jefe_de_turno: string | null
          lote: string | null
          maquina: string
          muestreo_real: number | null
          muestreo_recomendado: number | null
          numero_operario: string
          numero_orden: number
          orden_de_compra: string | null
          pedido: string
          producto: string
          status: Database["public"]["Enums"]["order_status"]
          turno: string
          unidades_por_embalaje: number
          updated_at: string
        }
        Insert: {
          cantidad_embalajes: number
          cliente: string
          codigo_producto: string
          created_at?: string
          fecha_fabricacion: string
          id?: string
          inspector_calidad: string
          jefe_de_turno?: string | null
          lote?: string | null
          maquina: string
          muestreo_real?: number | null
          muestreo_recomendado?: number | null
          numero_operario: string
          numero_orden?: number
          orden_de_compra?: string | null
          pedido: string
          producto: string
          status?: Database["public"]["Enums"]["order_status"]
          turno: string
          unidades_por_embalaje: number
          updated_at?: string
        }
        Update: {
          cantidad_embalajes?: number
          cliente?: string
          codigo_producto?: string
          created_at?: string
          fecha_fabricacion?: string
          id?: string
          inspector_calidad?: string
          jefe_de_turno?: string | null
          lote?: string | null
          maquina?: string
          muestreo_real?: number | null
          muestreo_recomendado?: number | null
          numero_operario?: string
          numero_orden?: number
          orden_de_compra?: string | null
          pedido?: string
          producto?: string
          status?: Database["public"]["Enums"]["order_status"]
          turno?: string
          unidades_por_embalaje?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders_tests: {
        Row: {
          aprobado: boolean
          cantidad_unidades_con_falla: number
          created_at: string
          id: number
          order: string
          pregunta: number
        }
        Insert: {
          aprobado: boolean
          cantidad_unidades_con_falla?: number
          created_at?: string
          id?: number
          order: string
          pregunta: number
        }
        Update: {
          aprobado?: boolean
          cantidad_unidades_con_falla?: number
          created_at?: string
          id?: number
          order?: string
          pregunta?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_preguntas_pregunta_fkey"
            columns: ["pregunta"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tests_order_fkey"
            columns: ["order"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      planes_de_muestreo: {
        Row: {
          aql: string
          codigo: string
          numero_maximo_fallas: number | null
          tamano_muestra: number | null
        }
        Insert: {
          aql: string
          codigo: string
          numero_maximo_fallas?: number | null
          tamano_muestra?: number | null
        }
        Update: {
          aql?: string
          codigo?: string
          numero_maximo_fallas?: number | null
          tamano_muestra?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          updated_at: string | null
          user_id: string
          user_role: Database["public"]["Enums"]["profile_role"]
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id?: string
          last_name: string
          updated_at?: string | null
          user_id: string
          user_role?: Database["public"]["Enums"]["profile_role"]
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string | null
          user_id?: string
          user_role?: Database["public"]["Enums"]["profile_role"]
        }
        Relationships: []
      }
      tests: {
        Row: {
          created_at: string
          id: number
          name: string
          type: Database["public"]["Enums"]["test_type"]
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          type: Database["public"]["Enums"]["test_type"]
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          type?: Database["public"]["Enums"]["test_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_change_user_role: {
        Args:
          | Record<PropertyKey, never>
          | {
              current_user_id: string
              new_role: string
              target_user_id: string
            }
          | { current_user_id: string; target_user_id: string }
          | {
              new_role: Database["public"]["Enums"]["profile_role"]
              target_user_id: string
            }
        Returns: boolean
      }
      get_all_profiles: {
        Args: {
          page_num?: number
          page_size?: number
          role_filter?: Database["public"]["Enums"]["profile_role"]
          search_term?: string
        }
        Returns: {
          created_at: string
          email: string
          first_name: string
          full_name: string
          id: string
          last_name: string
          total_count: number
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["profile_role"]
        }[]
      }
      get_user_profile: {
        Args: { user_id_param?: string }
        Returns: Json
      }
      hook_restrict_signup_to_admin_only: {
        Args: { event: Json }
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_from_jwt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_inspector_or_above: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_supervisor_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      user_has_role: {
        Args: {
          required_role: Database["public"]["Enums"]["profile_role"]
          user_id_param?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      order_status: "Aprobado" | "Rechazado"
      profile_role: "Admin" | "Inspector" | "Supervisor"
      test_type: "visual" | "funcional"
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
    Enums: {
      order_status: ["Aprobado", "Rechazado"],
      profile_role: ["Admin", "Inspector", "Supervisor"],
      test_type: ["visual", "funcional"],
    },
  },
} as const