import { defineStore } from 'pinia'
import type { Customer, CustomerFilters, CreateCustomerForm } from '~/types'
import { supabaseAPI } from '~/utils/supabase'

interface CustomersState {
  customers: Customer[]
  currentCustomer: Customer | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  filters: CustomerFilters
}

export const useCustomersStore = defineStore('customers', {
  state: (): CustomersState => ({
    customers: [],
    currentCustomer: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      per_page: 20,
      total: 0,
      total_pages: 0
    },
    filters: {}
  }),

  getters: {
    customersForSelect(): Array<{ value: string; label: string }> {
      return this.customers.map(customer => ({
        value: customer.id,
        label: customer.name
      }))
    }
  },

  actions: {
    async fetchCustomers(page = 1, filters: CustomerFilters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await supabaseAPI.getCustomers(page, this.pagination.per_page, filters)
        
        this.customers = response.data
        this.pagination = {
          page: response.page,
          per_page: response.per_page,
          total: response.total,
          total_pages: response.total_pages
        }
        this.filters = filters
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch customers'
      } finally {
        this.loading = false
      }
    },

    async fetchCustomerById(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useSupabaseClient()
          .from('customers')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        this.currentCustomer = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch customer'
      } finally {
        this.loading = false
      }
    },

    async createCustomer(customerData: CreateCustomerForm) {
      this.loading = true
      this.error = null
      
      try {
        const newCustomer = await supabaseAPI.createCustomer(customerData)
        this.customers.unshift(newCustomer)
        return newCustomer
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create customer'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCustomer(id: string, customerData: Partial<CreateCustomerForm>) {
      this.loading = true
      this.error = null
      
      try {
        const updatedCustomer = await supabaseAPI.updateCustomer(id, customerData)
        
        const customerIndex = this.customers.findIndex(customer => customer.id === id)
        if (customerIndex !== -1) {
          this.customers[customerIndex] = updatedCustomer
        }
        
        if (this.currentCustomer && this.currentCustomer.id === id) {
          this.currentCustomer = updatedCustomer
        }
        
        return updatedCustomer
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update customer'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCustomer(id: string) {
      this.loading = true
      this.error = null
      
      try {
        await supabaseAPI.deleteCustomer(id)
        
        this.customers = this.customers.filter(customer => customer.id !== id)
        if (this.currentCustomer && this.currentCustomer.id === id) {
          this.currentCustomer = null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete customer'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Search customers for order creation
    async searchCustomers(query: string): Promise<Customer[]> {
      if (!query.trim()) return []
      
      try {
        const customers = await supabaseAPI.searchCustomersForOrder(query)
        return customers
      } catch (error) {
        if (import.meta.server) {
          const { $logger } = useNuxtApp()
          if ($logger && typeof ($logger as any).error === 'function') {
            ($logger as any).error({
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              context: 'useCustomersStore.searchCustomersForOrder'
            }, 'Error searching customers for order')
          }
        }
        return []
      }
    },


    clearError() {
      this.error = null
    }
  }
})