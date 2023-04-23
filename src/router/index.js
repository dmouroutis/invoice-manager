import { createRouter, createWebHistory } from 'vue-router'
import InvoicesView from '../views/InvoicesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/invoices' },

    {
      path: '/invoices',
      name: 'invoices',
      component: InvoicesView
    },

    {
      path: '/invoice/:mode/:id?',
      name: 'invoice',
      component: () => import('../views/InvoiceView.vue')
    }
  ]
})

export default router
