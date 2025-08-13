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
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount: number
          order_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount: number
          order_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount?: number
          order_date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          stock_quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          stock_quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          stock_quantity?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          user_role: 'Admin' | 'Inspector' | 'Supervisor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          user_role: 'Admin' | 'Inspector' | 'Supervisor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          user_role?: 'Admin' | 'Inspector' | 'Supervisor'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_profiles: {
        Args: {
          search_term?: string | null
          role_filter?: string | null
          page_num: number
          page_size: number
        }
        Returns: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          user_role: 'Admin' | 'Inspector' | 'Supervisor'
          created_at: string
          updated_at: string
          full_name: string
          email: string
          total_count: number
        }[]
      }
      get_orders_with_customers: {
        Args: {
          search_term?: string | null
          status_filter?: string | null
          customer_id_filter?: string | null
          date_from_filter?: string | null
          date_to_filter?: string | null
          page_num: number
          page_size: number
        }
        Returns: {
          id: string
          customer_id: string
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount: number
          order_date: string
          created_at: string
          updated_at: string
          customer_name: string
          customer_email: string
          total_count: number
        }[]
      }
      get_products_with_stock: {
        Args: {
          search_term?: string | null
          low_stock_only: boolean
          low_stock_threshold: number
          page_num: number
          page_size: number
        }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          stock_quantity: number
          created_at: string
          updated_at: string
          total_count: number
        }[]
      }
      get_dashboard_metrics: {
        Args: Record<string, never>
        Returns: {
          pending_orders: number
          completed_orders: number
          cancelled_orders: number
          current_month_revenue: number
          current_week_revenue: number
        }
      }
      search_orders: {
        Args: {
          search_term?: string | null
          status_filter?: string | null
          customer_id_filter?: string | null
          date_from?: string | null
          date_to?: string | null
          page_num: number
          page_size: number
        }
        Returns: {
          id: string
          customer_id: string
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount: number
          order_date: string
          created_at: string
          updated_at: string
          customer_name: string
          customer_email: string
          total_count: number
        }[]
      }
      get_order_details: {
        Args: {
          order_id_param: string
        }
        Returns: {
          id: string
          customer_id: string
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          total_amount: number
          order_date: string
          created_at: string
          updated_at: string
          customer: {
            id: string
            name: string
            email: string
            phone: string
            address: string
          }
          order_items: {
            id: string
            product_id: string
            quantity: number
            unit_price: number
            subtotal: number
            product_name: string
            product_description: string
          }[]
        }
      }
      search_customers: {
        Args: {
          search_term?: string | null
          page_num: number
          page_size: number
        }
        Returns: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          created_at: string
          updated_at: string
          orders_count: number
          total_spent: number
          total_count: number
        }[]
      }
      search_products: {
        Args: {
          search_term?: string | null
          low_stock_only: boolean
          low_stock_threshold: number
          page_num: number
          page_size: number
        }
        Returns: {
          id: string
          name: string
          description: string
          price: number
          stock_quantity: number
          created_at: string
          updated_at: string
          times_ordered: number
          total_revenue: number
          total_count: number
        }[]
      }
      log_user_activity: {
        Args: {
          p_actor_user_id?: string | null
          p_target_user_id?: string | null
          p_activity_type: string
          p_activity_description: string
          p_metadata?: Json | null
        }
        Returns: undefined
      }
      get_activity_logs: {
        Args: {
          p_limit: number
          p_offset: number
          p_activity_type?: string | null
          p_target_user_id?: string | null
        }
        Returns: {
          id: string
          actor_user_id: string
          target_user_id: string | null
          activity_type: string
          activity_description: string
          metadata: Record<string, unknown>
          created_at: string
        }[]
      }
      get_user_profile: {
        Args: {
          user_id_param: string
        }
        Returns: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          user_role: 'Admin' | 'Inspector' | 'Supervisor'
          created_at: string
          updated_at: string
          full_name: string
          email: string
        }
      }
      user_has_role: {
        Args: {
          required_role: string
          user_id_param: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: {
          user_id_param: string
        }
        Returns: boolean
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