// Initial application dummy data
import initialProducts from '@/assets/data/products.json'
import initialInvoices from '@/assets/data/invoices.json'

import { defineStore } from 'pinia'

export const useInvoicesStore = defineStore('invoices', {
  state: () => {
    const localProducts = window.localStorage.getItem('products')
    const localInvoices = window.localStorage.getItem('invoices')

    return {
      // Restore data from localeStorage or initialize from dummy files
      products: localProducts ? JSON.parse(localProducts) : initialProducts,
      invoices: localInvoices ? JSON.parse(localInvoices) : initialInvoices
    }
  },
  // Any actions that manipulate invoices should save the invoices to localStorage afterwards to maintain the persistent data functionality
  actions: {
    createInvoice(invoiceData) {
      this.invoices.push(invoiceData)
      window.localStorage.setItem('invoices', JSON.stringify(this.invoices))
    },

    updateInvoice(invoiceData) {
      this.invoices = this.invoices.map((item) => {
        return item.id === invoiceData.id ? invoiceData : item
      })
      window.localStorage.setItem('invoices', JSON.stringify(this.invoices))
    },

    deleteInvoice(id) {
      this.invoices = this.invoices.filter((item) => item.id !== id)
      window.localStorage.setItem('invoices', JSON.stringify(this.invoices))
    }
  },
  getters: {
    getNextInvoiceIDs: (state) => {
      const maxInvoiceID = state.invoices.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      )

      const generateCode = (num) => {
        const paddedNum = num.toString().padStart(3, '0')
        return `ORS-${paddedNum}`
      }

      const id = maxInvoiceID.id + 1

      return {
        id,
        invoiceNumber: generateCode(id)
      }
    },

    getInvoiceById: (state) => {
      return (invoiceId) => state.invoices.find((item) => item.id === invoiceId)
    }
  }
})
