<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { View, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

// @TODO to be replaced with locastorage & state
const generateDummyData = (numEntries) => {
  const data = []

  for (let i = 0; i < numEntries; i++) {
    const id = i + 1

    const ORS = '' + id
    const recipient = `Recipient #${id}`
    const invoiceDate = new Date(2022, i % 12, (i % 28) + 1, 0, 0, 0)
    const invoiceNumber = `ORS-${'000'.substring(0, 3 - ORS.length) + ORS}`
    const status = ['PAID', 'UNPAID', 'DRAFT'][Math.floor(Math.random() * 3)]
    const total = Math.floor(Math.random() * 10000) / 100

    data.push({ id, recipient, invoiceDate, invoiceNumber, status, total })
  }

  return data
}

const tableData = ref([])

// Generate dummy data
tableData.value = generateDummyData(30)

const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // months are zero-based
  const year = date.getFullYear().toString()

  return `${day}/${month}/${year}`
}

const formatStatus = (status) => {
  if (status === 'PAID') return 'Paid in Full'
  else if (status === 'UNPAID') return 'Sent, Unpaid'
  else if (status === 'DRAFT') return 'Draft'
}

const confirmDeletion = (itemID) => {
  ElMessageBox.confirm('You will permanently delete this invoice. Continue?', 'Warning', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(() => {
      // Delete invoice
      tableData.value = tableData.value.filter((item) => item.id !== itemID)
    })
    .catch(() => {
      // Delete cancelled
    })
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
    <el-table class="width-100 mb-2" :data="tableData">
      <el-table-column prop="invoiceDate" label="Invoice Date">
        <template v-slot="scope">
          {{ formatDate(scope.row.invoiceDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="invoiceNumber" label="Invoice #"></el-table-column>
      <el-table-column prop="recipient" label="Recipient"></el-table-column>

      <el-table-column prop="status" label="Status">
        <template v-slot="scope">
          <span class="status" :class="scope.row.status">{{ formatStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="total" label="Final Amount">
        <template v-slot="scope"> USD ${{ scope.row.total.toFixed(2) }} </template>
      </el-table-column>

      <el-table-column label="Actions">
        <template v-slot="scope">
          <RouterLink :to="`/invoice/view/${scope.row.id}`">
            <el-button class="mr-1" type="success" :icon="View" circle />
          </RouterLink>

          <RouterLink :to="`/invoice/edit/${scope.row.id}`">
            <el-button class="mr-1" type="warning" :icon="Edit" circle />
          </RouterLink>

          <el-button @click="confirmDeletion(scope.row.id)" type="danger" :icon="Delete" circle />
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
