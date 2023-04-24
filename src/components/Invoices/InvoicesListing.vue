<script setup>
import statuses from '@/assets/data/statuses.json'
import useScreenWidth from '@/helpers/useScreenWidth'

import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useInvoicesStore } from '@/stores/invoices'

import { View, Edit, Delete, Search } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const store = useInvoicesStore()

const { screenWidth } = useScreenWidth()
const isMobile = computed(() => {
  return screenWidth.value < 767
})

const search = ref('')

const filteredInvoices = computed(() => {
  const s = search.value.toLowerCase()
  if (!s) return store.invoices

  return store.invoices.filter((invoice) => {
    const hasProductMatch = invoice.lineItems.filter((item) =>
      item.product.name.toLowerCase().includes(s)
    )

    return (
      invoice.recipient.toLowerCase().includes(s) ||
      invoice.invoiceNumber.toLowerCase().includes(s) ||
      hasProductMatch.length
    )
  })
})

const formatDate = (invoiceDate) => {
  // Due to JSON stringify/parsing we need to revert the date back to DateTime object
  const date = typeof invoiceDate === 'string' ? new Date(invoiceDate) : invoiceDate

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // months are zero-based
  const year = date.getFullYear().toString()

  return `${day}/${month}/${year}`
}

const formatStatus = (code) => {
  return statuses.find((status) => status.code === code).label
}

const confirmDeletion = (invoiceID) => {
  ElMessageBox.confirm('You will permanently delete this invoice. Continue?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      // Delete invoice
      store.deleteInvoice(invoiceID)
    })
    .catch(() => {
      // Delete cancelled
    })
}

const dateSorting = (a, b) => {
  // Due to JSON stringify/parsing we need to revert the date back to DateTime object
  const date1 = typeof a.invoiceDate === 'string' ? new Date(a.invoiceDate) : a.invoiceDate
  const date2 = typeof b.invoiceDate === 'string' ? new Date(b.invoiceDate) : b.invoiceDate

  return date1 > date2 ? 1 : -1
}
</script>

<template>
  <el-card>
    <el-input
      v-model="search"
      size="large"
      placeholder="Search invoices by number, recipient or invoice products"
      :suffix-icon="Search"
      class="mb-2"
    />

    <el-table
      class="width-100 mb-2"
      :data="filteredInvoices"
      :default-sort="{ prop: 'invoiceDate', order: 'descending' }"
    >
      <el-table-column
        sortable
        :sort-method="dateSorting"
        prop="invoiceDate"
        label="Invoice Date"
        :width="isMobile ? 140 : 'auto'"
      >
        <template #default="{ row }">
          {{ formatDate(row.invoiceDate) }}
        </template>
      </el-table-column>

      <el-table-column
        sortable
        prop="invoiceNumber"
        label="Invoice #"
        :width="isMobile ? 120 : 'auto'"
      >
      </el-table-column>

      <el-table-column sortable prop="recipient" label="Recipient" :width="isMobile ? 120 : 'auto'">
      </el-table-column>

      <el-table-column sortable prop="status" label="Status" :width="isMobile ? 140 : 'auto'">
        <template #default="{ row }">
          <span class="status" :class="row.status">{{ formatStatus(row.status) }}</span>
        </template>
      </el-table-column>

      <el-table-column sortable prop="total" label="Final Amount" :width="isMobile ? 150 : 'auto'">
        <template #default="{ row }"> USD ${{ row.total.toFixed(2) }} </template>
      </el-table-column>

      <el-table-column label="Actions" :width="isMobile ? 150 : 'auto'">
        <template #default="{ row }">
          <RouterLink :to="`/invoice/view/${row.id}`">
            <el-button class="mr-1" type="success" :icon="View" circle />
          </RouterLink>

          <RouterLink :to="`/invoice/edit/${row.id}`">
            <el-button class="mr-1" type="warning" :icon="Edit" circle />
          </RouterLink>

          <el-button @click="confirmDeletion(row.id)" type="danger" :icon="Delete" circle />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
.status {
  display: inline-block;
  padding: 4px 8px;
  color: #ffffff;
  border-radius: 16px;
}

.status.PAID {
  background-color: var(--el-color-success);
}
.status.UNPAID {
  background-color: var(--el-color-danger);
}
.status.DRAFT {
  background-color: var(--el-color-warning);
}
</style>
