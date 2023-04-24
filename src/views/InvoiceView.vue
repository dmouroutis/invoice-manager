<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInvoicesStore } from '@/stores/invoices'

import PageContainer from '../components/PageContainer.vue'
import InvoiceManagerTable from '../components/Invoices/InvoiceManagerTable.vue'

const route = useRoute()
const router = useRouter()

const store = useInvoicesStore()

const mode = route.params.mode
const invoiceID = parseInt(route.params.id)

const title = computed(() => {
  if (mode === 'create') {
    return 'Creating Invoice'
  } else {
    const action = mode === 'view' ? 'Viewing' : 'Editing'
    const invoice = store.getInvoiceById(invoiceID)

    return `${action} Invoice #${invoice.invoiceNumber}`
  }
})
</script>

<template>
  <PageContainer>
    <el-card class="mb-2">
      <el-page-header @back="router.back()">
        <template #content>
          <p>{{ title }}</p>
        </template>
      </el-page-header>
    </el-card>

    <InvoiceManagerTable :mode="mode" :id="invoiceID" />
  </PageContainer>
</template>
