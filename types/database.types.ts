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
          user_role: string
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
          status: string
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}