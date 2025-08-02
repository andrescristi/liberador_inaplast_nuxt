import { defineStore } from 'pinia'
import type { Product, ProductFilters, CreateProductForm } from '~/types'
import { supabaseAPI } from '~/utils/supabase'

interface ProductsState {
  products: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
  filters: ProductFilters
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    currentProduct: null,
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
    productsForSelect(): Array<{ value: string; label: string; price: number; stock: number }> {
      return this.products.map(product => ({
        value: product.id,
        label: product.name,
        price: product.price,
        stock: product.stock_quantity
      }))
    },

    lowStockProducts(): Product[] {
      return this.products.filter(product => product.stock_quantity < 10)
    }
  },

  actions: {
    async fetchProducts(page = 1, filters: ProductFilters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const response = await supabaseAPI.getProducts(page, this.pagination.per_page, filters)
        
        this.products = response.data
        this.pagination = {
          page: response.page,
          per_page: response.per_page,
          total: response.total,
          total_pages: response.total_pages
        }
        this.filters = filters
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch products'
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id: string) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useSupabaseClient()
          .from('products')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        this.currentProduct = data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch product'
        console.error('Error fetching product:', error)
      } finally {
        this.loading = false
      }
    },

    async createProduct(productData: CreateProductForm) {
      this.loading = true
      this.error = null
      
      try {
        const newProduct = await supabaseAPI.createProduct(productData)
        this.products.unshift(newProduct)
        return newProduct
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create product'
        console.error('Error creating product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: string, productData: Partial<CreateProductForm>) {
      this.loading = true
      this.error = null
      
      try {
        const updatedProduct = await supabaseAPI.updateProduct(id, productData)
        
        const productIndex = this.products.findIndex(product => product.id === id)
        if (productIndex !== -1) {
          this.products[productIndex] = updatedProduct
        }
        
        if (this.currentProduct && this.currentProduct.id === id) {
          this.currentProduct = updatedProduct
        }
        
        return updatedProduct
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update product'
        console.error('Error updating product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: string) {
      this.loading = true
      this.error = null
      
      try {
        await supabaseAPI.deleteProduct(id)
        
        this.products = this.products.filter(product => product.id !== id)
        if (this.currentProduct && this.currentProduct.id === id) {
          this.currentProduct = null
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete product'
        console.error('Error deleting product:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchProducts(query: string): Promise<Product[]> {
      if (!query.trim()) return []
      
      try {
        const products = await supabaseAPI.searchProductsForOrder(query)
        return products
      } catch (error) {
        console.error('Error searching products:', error)
        return []
      }
    },


    clearError() {
      this.error = null
    }
  }
})