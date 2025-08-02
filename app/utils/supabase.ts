// Supabase API utilities for Order Management System
// Created: 2025-08-01
// Description: Utility functions for database operations

import type { 
  Customer, 
  Product, 
  Order, 
  OrderItem, 
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

// Database query utilities
export class SupabaseAPI {
  private getClient() {
    return useSupabaseClient()
  }

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const { data, error } = await this.getClient()
      .rpc('get_dashboard_metrics')

    if (error) {
      console.error('Error fetching dashboard metrics:', error)
      throw new Error('Failed to fetch dashboard metrics')
    }

    return data || {
      pending_orders: 0,
      completed_orders: 0,
      cancelled_orders: 0,
      current_month_revenue: 0,
      current_week_revenue: 0
    }
  }

  // Orders
  async getOrders(
    page = 1, 
    perPage = 20, 
    filters: OrderFilters = {}
  ): Promise<PaginatedResponse<Order>> {
    const { data, error } = await this.client
      .rpc('search_orders', {
        search_term: filters.search || null,
        status_filter: filters.status || null,
        customer_id_filter: filters.customer_id ? filters.customer_id : null,
        date_from: filters.date_from ? new Date(filters.date_from).toISOString() : null,
        date_to: filters.date_to ? new Date(filters.date_to).toISOString() : null,
        page_num: page,
        page_size: perPage
      })

    if (error) {
      console.error('Error fetching orders:', error)
      throw new Error('Failed to fetch orders')
    }

    const orders = data || []
    const totalCount = orders[0]?.total_count || 0

    return {
      data: orders.map((row: any) => ({
        id: row.id,
        customer_id: row.customer_id,
        status: row.status,
        total_amount: parseFloat(row.total_amount),
        order_date: row.order_date,
        created_at: row.created_at,
        updated_at: row.updated_at,
        customer: row.customer_name ? {
          id: row.customer_id,
          name: row.customer_name,
          email: row.customer_email,
          phone: '',
          address: '',
          created_at: '',
          updated_at: ''
        } : undefined
      })),
      total: totalCount,
      page,
      per_page: perPage,
      total_pages: Math.ceil(totalCount / perPage)
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await this.client
      .rpc('get_order_details', { order_id_param: id })

    if (error) {
      console.error('Error fetching order:', error)
      throw new Error('Failed to fetch order details')
    }

    return data || null
  }

  async createOrder(orderData: CreateOrderForm): Promise<Order> {
    const { data: customer } = await this.client
      .from('customers')
      .select('*')
      .eq('id', orderData.customer_id)
      .single()

    if (!customer) {
      throw new Error('Customer not found')
    }

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
      console.error('Error creating order:', orderError)
      throw new Error('Failed to create order')
    }

    // Insert order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.quantity * item.unit_price
    }))

    const { error: itemsError } = await this.client
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Rollback order creation
      await this.client.from('orders').delete().eq('id', order.id)
      throw new Error('Failed to create order items')
    }

    return {
      ...order,
      customer,
      total_amount: totalAmount
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order status:', error)
      throw new Error('Failed to update order status')
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (error) {
      console.error('Error deleting order:', error)
      throw new Error('Failed to delete order')
    }
  }

  // Customers
  async getCustomers(
    page = 1, 
    perPage = 20, 
    filters: CustomerFilters = {}
  ): Promise<PaginatedResponse<Customer & { orders_count: number, total_spent: number }>> {
    const { data, error } = await this.client
      .rpc('search_customers', {
        search_term: filters.search || null,
        page_num: page,
        page_size: perPage
      })

    if (error) {
      console.error('Error fetching customers:', error)
      throw new Error('Failed to fetch customers')
    }

    const customers = data || []
    const totalCount = customers[0]?.total_count || 0

    return {
      data: customers.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        address: row.address,
        created_at: row.created_at,
        updated_at: row.updated_at,
        orders_count: row.orders_count,
        total_spent: parseFloat(row.total_spent)
      })),
      total: totalCount,
      page,
      per_page: perPage,
      total_pages: Math.ceil(totalCount / perPage)
    }
  }

  async createCustomer(customerData: CreateCustomerForm): Promise<Customer> {
    const { data, error } = await this.client
      .from('customers')
      .insert(customerData)
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      throw new Error('Failed to create customer')
    }

    return data
  }

  async updateCustomer(id: string, customerData: Partial<CreateCustomerForm>): Promise<Customer> {
    const { data, error } = await this.client
      .from('customers')
      .update(customerData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating customer:', error)
      throw new Error('Failed to update customer')
    }

    return data
  }

  async deleteCustomer(id: string): Promise<void> {
    const { error } = await this.client
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting customer:', error)
      throw new Error('Failed to delete customer')
    }
  }

  // Products
  async getProducts(
    page = 1, 
    perPage = 20, 
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product & { times_ordered: number, total_revenue: number }>> {
    const { data, error } = await this.client
      .rpc('search_products', {
        search_term: filters.search || null,
        low_stock_only: filters.low_stock || false,
        low_stock_threshold: 10,
        page_num: page,
        page_size: perPage
      })

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }

    const products = data || []
    const totalCount = products[0]?.total_count || 0

    return {
      data: products.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: parseFloat(row.price),
        stock_quantity: row.stock_quantity,
        created_at: row.created_at,
        updated_at: row.updated_at,
        times_ordered: row.times_ordered,
        total_revenue: parseFloat(row.total_revenue)
      })),
      total: totalCount,
      page,
      per_page: perPage,
      total_pages: Math.ceil(totalCount / perPage)
    }
  }

  async createProduct(productData: CreateProductForm): Promise<Product> {
    const { data, error } = await this.client
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    }

    return data
  }

  async updateProduct(id: string, productData: Partial<CreateProductForm>): Promise<Product> {
    const { data, error } = await this.client
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw new Error('Failed to update product')
    }

    return data
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.client
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw new Error('Failed to delete product')
    }
  }

  // Utility methods
  async getRecentOrders(limit = 10): Promise<Order[]> {
    const { data, error } = await this.client
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent orders:', error)
      throw new Error('Failed to fetch recent orders')
    }

    return data || []
  }

  async searchCustomersForOrder(searchTerm: string): Promise<Customer[]> {
    const { data, error } = await this.client
      .from('customers')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(10)

    if (error) {
      console.error('Error searching customers:', error)
      throw new Error('Failed to search customers')
    }

    return data || []
  }

  async searchProductsForOrder(searchTerm: string): Promise<Product[]> {
    const { data, error } = await this.client
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .gt('stock_quantity', 0)
      .limit(10)

    if (error) {
      console.error('Error searching products:', error)
      throw new Error('Failed to search products')
    }

    return data || []
  }
}

// Export singleton instance
export const supabaseAPI = new SupabaseAPI()