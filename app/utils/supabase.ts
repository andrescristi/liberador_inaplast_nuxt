// Supabase API utilities for Order Management System
// Created: 2025-08-01
// Description: Utility functions for database operations

import type { 
  Customer, 
  Product, 
  Order, 
  CreateOrderForm, 
  CreateCustomerForm, 
  CreateProductForm,
  OrderFilters,
  CustomerFilters,
  ProductFilters,
  PaginatedResponse,
  DashboardMetrics,
  OrderStatus
} from '~/types'
import type { Database } from '../../types/database.types'

// Database query utilities
export class SupabaseAPI {
  private get client() {
    return useSupabaseClient<Database>()
  }

  private getClient() {
    return useSupabaseClient<Database>()
  }

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    // TODO: Implement get_dashboard_metrics RPC function
    // const { data, error } = await this.getClient()
    //   .rpc('get_dashboard_metrics')

    // if (error) {
    //   // Handle dashboard metrics error
    //   throw new Error('Failed to fetch dashboard metrics')
    // }

    // return data || {
    return {
      pending_orders: 0,
      completed_orders: 0,
      cancelled_orders: 0,
      current_month_revenue: 0,
      current_week_revenue: 0
    }
  }

  // Orders
  async getOrders(
    _page = 1, 
    _perPage = 20, 
    _filters: OrderFilters = {}
  ): Promise<PaginatedResponse<Order>> {
    // TODO: Implement search_orders RPC function
    // const { data, error } = await this.client
    //   .rpc('search_orders', {
    //     search_term: filters.search || null,
    //     status_filter: filters.status || null,
    //     customer_id_filter: filters.customer_id ? filters.customer_id : null,
    //     date_from: filters.date_from ? new Date(filters.date_from).toISOString() : null,
    //     date_to: filters.date_to ? new Date(filters.date_to).toISOString() : null,
    //     page_num: page,
    //     page_size: perPage
    //   })

    // if (error) {
    //   // Handle orders fetch error
    //   throw new Error('Failed to fetch orders')
    // }

    // const orders = data || []
    // const totalCount = orders[0]?.total_count || 0

    return {
      data: [],
      total: 0,
      page: 1,
      per_page: 20,
      total_pages: 0
    }
  }

  async getOrderById(_id: string): Promise<Order | null> {
    // TODO: Implement get_order_details RPC function
    // const { data, error } = await this.client
    //   .rpc('get_order_details', { order_id_param: id })

    // if (error) {
    //   // Handle order fetch error
    //   throw new Error('Failed to fetch order details')
    // }

    // return (data as unknown) as Order || null
    return null
  }

  async createOrder(orderData: CreateOrderForm): Promise<Order> {
    // TODO: Implement customers table in database
    // const { data: customer } = await this.client
    //   .from('customers')
    //   .select('*')
    //   .eq('id', orderData.customer_id)
    //   .single()

    // if (!customer) {
    //   throw new Error('Customer not found')
    // }
    
    throw new Error('Customers table not implemented')

    // Calculate total
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + (item.quantity * item.unit_price), 
      0
    )

    // Start transaction
    const { data: order, error: orderError } = await this.client
      .from('orders')
      .insert({
        customer_id: orderData.customer_id,
        status: 'pending',
        total_amount: totalAmount
      })
      .select()
      .single()

    if (orderError) {
      // Handle order creation error
      throw new Error('Failed to create order')
    }

    // Insert order items
    // TODO: Implement order_items table
    // const orderItems = orderData.items.map(item => ({
    //   order_id: order.id,
    //   product_id: item.product_id,
    //   quantity: item.quantity,
    //   unit_price: item.unit_price,
    //   subtotal: item.quantity * item.unit_price
    // }))

    // const { error: itemsError } = await this.client
    //   .from('order_items')
    //   .insert(orderItems)

    // if (itemsError) {
    //   // Handle order items creation error
    //   // Rollback order creation
    //   await this.client.from('orders').delete().eq('id', order.id)
    //   throw new Error('Failed to create order items')
    // }

    if (!order?.id) {
      throw new Error('Order creation failed')
    }

    const validOrder = order!

    return {
      id: validOrder.id!,
      customer_id: validOrder.customer_id!,
      status: (validOrder.status || 'pending') as OrderStatus,
      total_amount: totalAmount,
      order_date: validOrder.order_date || new Date().toISOString(),
      created_at: validOrder.created_at || new Date().toISOString(),
      updated_at: validOrder.updated_at || new Date().toISOString()
      // customer,  // TODO: uncomment when customers table is implemented
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      // Handle order status update error
      throw new Error('Failed to update order status')
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      // Handle order deletion error
      throw new Error('Failed to delete order')
    }
  }

  // Customers
  async getCustomers(
    _page = 1, 
    _perPage = 20, 
    _filters: CustomerFilters = {}
  ): Promise<PaginatedResponse<Customer & { orders_count: number, total_spent: number }>> {
    // TODO: Implement search_customers RPC function and customers table
    // const { data, error } = await this.client
    //   .rpc('search_customers', {
    //     search_term: filters.search || null,
    //     page_num: page,
    //     page_size: perPage
    //   })

    // if (error) {
    //   // Handle customers fetch error
    //   throw new Error('Failed to fetch customers')
    // }

    // const customers = data || []
    // const totalCount = customers[0]?.total_count || 0

    return {
      data: [],
      total: 0,
      page: 1,
      per_page: 20,
      total_pages: 0
    }
  }

  async createCustomer(_customerData: CreateCustomerForm): Promise<Customer> {
    // TODO: Implement customers table in database
    // const { data, error } = await this.client
    //   .from('customers')
    //   .insert(customerData)
    //   .select()
    //   .single()

    // if (error) {
    //   // Handle customer creation error
    //   throw new Error('Failed to create customer')
    // }

    // return data
    throw new Error('Customers table not implemented')
  }

  async updateCustomer(_id: string, _customerData: Partial<CreateCustomerForm>): Promise<Customer> {
    // TODO: Implement customers table in database
    // const { data, error } = await this.client
    //   .from('customers')
    //   .update(customerData)
    //   .eq('id', id)
    //   .select()
    //   .single()

    // if (error) {
    //   // Handle customer update error
    //   throw new Error('Failed to update customer')
    // }

    // return data
    throw new Error('Customers table not implemented')
  }

  async deleteCustomer(_id: string): Promise<void> {
    // TODO: Implement customers table in database
    // const { error } = await this.client
    //   .from('customers')
    //   .delete()
    //   .eq('id', id)

    // if (error) {
    //   // Handle customer deletion error
    //   throw new Error('Failed to delete customer')
    // }
    throw new Error('Customers table not implemented')
  }

  // Products
  async getProducts(
    _page = 1, 
    _perPage = 20, 
    _filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product & { times_ordered: number, total_revenue: number }>> {
    // TODO: Implement search_products RPC function and products table
    // const { data, error } = await this.client
    //   .rpc('search_products', {
    //     search_term: filters.search || null,
    //     low_stock_only: filters.low_stock || false,
    //     low_stock_threshold: 10,
    //     page_num: page,
    //     page_size: perPage
    //   })

    // if (error) {
    //   // Handle products fetch error
    //   throw new Error('Failed to fetch products')
    // }

    // const products = data || []
    // const totalCount = products[0]?.total_count || 0

    return {
      data: [],
      total: 0,
      page: 1,
      per_page: 20,
      total_pages: 0
    }
  }

  async createProduct(_productData: CreateProductForm): Promise<Product> {
    // TODO: Implement products table in database
    // const { data, error } = await this.client
    //   .from('products')
    //   .insert(productData)
    //   .select()
    //   .single()

    // if (error) {
    //   // Handle product creation error
    //   throw new Error('Failed to create product')
    // }

    // return data
    throw new Error('Products table not implemented')
  }

  async updateProduct(_id: string, _productData: Partial<CreateProductForm>): Promise<Product> {
    // TODO: Implement products table in database
    // const { data, error } = await this.client
    //   .from('products')
    //   .update(productData)
    //   .eq('id', id)
    //   .select()
    //   .single()

    // if (error) {
    //   // Handle product update error
    //   throw new Error('Failed to update product')
    // }

    // return data
    throw new Error('Products table not implemented')
  }

  async deleteProduct(_id: string): Promise<void> {
    // TODO: Implement products table in database
    // const { error } = await this.client
    //   .from('products')
    //   .delete()
    //   .eq('id', id)

    // if (error) {
    //   // Handle product deletion error
    //   throw new Error('Failed to delete product')
    // }
    throw new Error('Products table not implemented')
  }

  // Utility methods
  async getRecentOrders(_limit = 10): Promise<Order[]> {
    // TODO: Implement customers, products, and order_items tables
    // const { data, error } = await this.client
    //   .from('orders')
    //   .select(`
    //     *,
    //     customer:customers(*),
    //     order_items(
    //       *,
    //       product:products(*)
    //     )
    //   `)
    //   .order('created_at', { ascending: false })
    //   .limit(limit)

    // if (error) {
    //   // Handle recent orders fetch error
    //   throw new Error('Failed to fetch recent orders')
    // }

    // return data || []
    return []
  }

  async searchCustomersForOrder(_searchTerm: string): Promise<Customer[]> {
    // TODO: Implement customers table in database
    // const { data, error } = await this.client
    //   .from('customers')
    //   .select('*')
    //   .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    //   .limit(10)

    // if (error) {
    //   // Handle customer search error
    //   throw new Error('Failed to search customers')
    // }

    // return data || []
    return []
  }

  async searchProductsForOrder(_searchTerm: string): Promise<Product[]> {
    // TODO: Implement products table in database
    // const { data, error } = await this.client
    //   .from('products')
    //   .select('*')
    //   .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    //   .gt('stock_quantity', 0)
    //   .limit(10)

    // if (error) {
    //   // Handle product search error
    //   throw new Error('Failed to search products')
    // }

    // return data || []
    return []
  }
}

// Export singleton instance
export const supabaseAPI = new SupabaseAPI()