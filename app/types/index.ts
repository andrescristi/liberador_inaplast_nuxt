// Database entity types based on project specification

// Profile and authentication types
export type ProfileRole = 'Admin' | 'Inspector' | 'Supervisor'

export interface Profile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  user_role: ProfileRole
  created_at: string
  updated_at: string
  full_name?: string // Computed field
  email?: string // Populated from auth.users
}

export interface CreateProfileForm {
  first_name: string
  last_name: string
  user_role: ProfileRole
}

export interface UpdateProfileForm {
  first_name?: string
  last_name?: string
  user_role?: ProfileRole
}

export interface ProfileFilters {
  search?: string
  role_filter?: ProfileRole
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  created_at: string
  updated_at: string
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface Order {
  id: string
  customer_id: string
  status: OrderStatus
  total_amount: number
  order_date: string
  created_at: string
  updated_at: string
  customer?: Customer // Optional populated field
  order_items?: OrderItem[] // Optional populated field
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
  product?: Product // Optional populated field
}

// Form types
export interface CreateOrderForm {
  customer_id: string
  items: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
}

export interface CreateCustomerForm {
  name: string
  email: string
  phone: string
  address: string
}

export interface CreateProductForm {
  name: string
  description: string
  price: number
  stock_quantity: number
}

// API response types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Dashboard metrics
export interface DashboardMetrics {
  pending_orders: number
  completed_orders: number
  cancelled_orders: number
  current_month_revenue: number
  current_week_revenue: number
}

// Filter types
export interface OrderFilters {
  status?: OrderStatus
  customer_id?: string
  date_from?: string
  date_to?: string
  search?: string
}

export interface CustomerFilters {
  search?: string
}

export interface ProductFilters {
  search?: string
  low_stock?: boolean
}

// Status timeline item
export interface StatusTimelineItem {
  status: OrderStatus
  timestamp: string
  completed: boolean
}