<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoicesStore } from '@/stores/invoices'

import statuses from '@/assets/data/statuses.json'

const router = useRouter()
const store = useInvoicesStore()

const props = defineProps({
  mode: String,
  id: Number
})

const title = computed(() => {
  if (props.mode === 'view') return `Viewing Invoice #${invoice.invoiceNumber}`
  else if (props.mode === 'edit') return `Editing Invoice #${invoice.invoiceNumber}`
  return `Creating Invoice`
})

const formData = ref({
  recipient: '',
  date: '',
  status: '',
  lineItems: [
    {
      product: {},
      quantity: 0,
      total: 0
    }
  ]
})

const invoiceTotal = computed(() => {
  let sum = 0

  Object.entries(formData.value.lineItems).forEach(([, item]) => {
    sum += item.total
  })

  return sum
})

const isDisabled = computed(() => props.mode === 'view')

const invoice = store.getInvoiceById(props.id)

const addLineItem = () => {
  formData.value.lineItems.push({
    product: {},
    quantity: 0,
    total: 0
  })
}

const removeLineItem = (row) => {
  const index = formData.value.lineItems.indexOf(row)
  formData.value.lineItems.splice(index, 1)
}

const updateLineItem = (quantity, lineItem) => {
  const subtotal = lineItem.product.unitPrice * quantity
  const total = subtotal + subtotal * lineItem.product.tax

  // round to 2 decimals
  lineItem.total = Math.round(total * 100) / 100
}

const submitForm = () => {
  // Handle form submission here
}
</script>

<template>
  <el-card class="mb-2">
    <el-page-header @back="router.back()">
      <template #content>
        <p>{{ title }}</p>
      </template>
    </el-page-header>
  </el-card>

  <el-card>
    <el-form :model="formData" :disabled="isDisabled" ref="form" label-width="120px">
      <el-form-item label="Recipient">
        <el-input v-model="formData.recipient"></el-input>
      </el-form-item>
      <el-form-item label="Date">
        <el-date-picker v-model="formData.date" type="datetime"></el-date-picker>
      </el-form-item>
      <el-form-item label="Status">
        <el-select v-model="formData.status" placeholder="Select">
          <el-option
            v-for="status in statuses"
            :key="status.code"
            :label="status.label"
            :value="status.code"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-table class="mb-2" :data="formData.lineItems" style="width: 100%">
          <el-table-column label="Items">
            <template #default="scope">
              <el-select v-model="scope.row.product" value-key="id" placeholder="Select Item">
                <el-option
                  v-for="product in store.products"
                  :label="product.name"
                  :key="scope.$index + product.id"
                  :value="product"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Description">
            <template #default="{ row }">
              <span v-if="row.product.description">{{ row.product.description }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Quantity">
            <template #default="{ row }">
              <el-input-number
                v-if="row.product.id"
                v-model="row.quantity"
                @change="updateLineItem($event, row)"
                :min="0"
              />
            </template>
          </el-table-column>

          <el-table-column label="Price" width="120px">
            <template #default="{ row }">
              <span v-if="row.product.unitPrice"> ${{ row.product.unitPrice }} </span>
            </template>
          </el-table-column>

          <el-table-column label="Tax" width="120px">
            <template #default="{ row }">
              <span v-if="row.product.tax"> {{ row.product.tax * 100 }}% </span>
            </template>
          </el-table-column>

          <el-table-column label="Total" width="120px">
            <template #default="{ row }">
              <span v-if="row.product.id">${{ row.total }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Actions">
            <template #default="{ row }">
              <el-button type="danger" @click="removeLineItem(row)"> Remove </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button v-if="!isDisabled" @click="addLineItem">Add Line Item</el-button>
      </el-form-item>

      <el-form-item>
        <h2>Total: ${{ invoiceTotal }}</h2>
      </el-form-item>

      <el-form-item v-if="!isDisabled">
        <el-button type="primary" @click="submitForm"> Submit </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
