// Initial application dummy data
import initialProducts from '@/assets/data/products.json'
import initialLineItems from '@/assets/data/lineItems.json'
import initialInvoices from '@/assets/data/invoices.json'

import { defineStore } from 'pinia'

export const useInvoicesStore = defineStore('invoices', {
  state: () => {
    const localProducts = window.localStorage.getItem('products')
    const localLineItems = window.localStorage.getItem('lineItems')
    const localInvoices = window.localStorage.getItem('invoices')

    return {
      // Restore data from localeStorage or initialize from dummy files
      products: localProducts ? JSON.parse(localProducts) : initialProducts,
      lineItems: localLineItems ? JSON.parse(localLineItems) : initialLineItems,
      invoices: localInvoices ? JSON.parse(localInvoices) : initialInvoices
    }
  },
  // Any actions that manipulate invoices should save the invoices to localStorage afterwards to maintain the persistent data functionality
  actions: {
    deleteInvoice(id) {
      this.invoices = this.invoices.filter((item) => item.id !== id)
      window.localStorage.setItem('invoices', JSON.stringify(this.invoices))
    }
  }
})
