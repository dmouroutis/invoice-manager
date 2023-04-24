<script setup>
import { RouterLink } from 'vue-router'
import { View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

import statuses from '@/assets/data/statuses.json'

import { useInvoicesStore } from '@/stores/invoices'

const store = useInvoicesStore()

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
  const date2 = typeof a.invoiceDate === 'string' ? new Date(b.invoiceDate) : b.invoiceDate

  return date1 > date2 ? 1 : -1
}
</script>

<template>
  <el-card class="mb-2">
    <div class="d-flex align-center justify-space-between">
      <h1>Invoices</h1>

      <RouterLink to="/invoice/create">
        <el-button type="primary">New Invoice</el-button>
      </RouterLink>
    </div>
  </el-card>

  <el-card>
    <el-table
      class="width-100 mb-2"
      :data="store.invoices"
      :default-sort="{ prop: 'invoiceDate', order: 'descending' }"
    >
      <el-table-column sortable :sort-method="dateSorting" prop="invoiceDate" label="Invoice Date">
        <template #default="{ row }">
          {{ formatDate(row.invoiceDate) }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="invoiceNumber" label="Invoice #"></el-table-column>
      <el-table-column sortable prop="recipient" label="Recipient"></el-table-column>

      <el-table-column sortable prop="status" label="Status">
        <template #default="{ row }">
          <span class="status" :class="row.status">{{ formatStatus(row.status) }}</span>
        </template>
      </el-table-column>

      <el-table-column sortable prop="total" label="Final Amount">
        <template #default="{ row }"> USD ${{ row.total.toFixed(2) }} </template>
      </el-table-column>

      <el-table-column label="Actions">
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
