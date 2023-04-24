<script setup>
import statuses from '@/assets/data/statuses.json'
import useScreenWidth from '@/helpers/useScreenWidth'

import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useInvoicesStore } from '@/stores/invoices'

import { ElNotification } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const router = useRouter()
const store = useInvoicesStore()

const props = defineProps({
  mode: String,
  id: Number
})

const { screenWidth } = useScreenWidth()
const isMobile = computed(() => {
  return screenWidth.value < 767
})

// Expanded for better clarity, create mode has no data yet.
const initFormData = () => {
  if (props.mode === 'create') {
    const getNextInvoiceIDs = store.getNextInvoiceIDs

    return ref({
      id: getNextInvoiceIDs.id,
      invoiceNumber: getNextInvoiceIDs.invoiceNumber,
      recipient: '',
      invoiceDate: '',
      status: 'DRAFT',
      lineItems: [
        {
          product: {},
          quantity: 0,
          total: 0
        }
      ]
    })
  } else {
    const invoice = store.getInvoiceById(props.id)

    // Sever object-deep reference and update data only on form save
    return ref(JSON.parse(JSON.stringify(invoice)))
  }
}
const form = ref()
const formData = initFormData()

const rules = reactive({
  recipient: [{ required: true, message: 'Please input a Recipient name', trigger: 'blur' }],
  invoiceDate: [
    {
      type: 'date',
      required: true,
      message: 'Please pick an Invoice date',
      trigger: 'change'
    }
  ],
  lineItems: [
    {
      validator: (rule, value, callback) => {
        const products = value.filter((item) => item.product.id && item.quantity > 0)

        if (products.length > 0) {
          callback()
        } else {
          callback(
            new Error('Please select at least one product and enter its corresponding quantity')
          )
        }
      },
      trigger: 'change'
    }
  ]
})

const title = computed(() => {
  const action = props.mode === 'view' ? 'Viewing' : props.mode === 'edit' ? 'Editing' : 'Creating'
  return `${action} Invoice #${formData.value.invoiceNumber}`
})

const invoiceTotal = computed(() => {
  let sum = 0

  Object.entries(formData.value.lineItems).forEach(([, item]) => {
    sum += item.total
  })

  return Math.round(sum * 100) / 100
})

const isEditable = computed(() => props.mode !== 'view')

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

const submitForm = async (formEl) => {
  if (!formEl) return

  await formEl.validate((valid) => {
    if (valid) {
      const invoice = {
        ...formData.value,
        total: invoiceTotal
      }

      // Remove any products without quantity
      invoice.lineItems = invoice.lineItems.filter((item) => item.quantity > 0)

      if (props.mode === 'create') {
        store.createInvoice(invoice)

        ElNotification({
          title: 'Invoice has been created',
          type: 'success',
          duration: 1500
        })
      } else {
        store.updateInvoice(invoice)

        ElNotification({
          title: 'Invoice has been updated',
          type: 'success',
          duration: 1500
        })
      }
    }
  })
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
    <el-form
      :rules="rules"
      :model="formData"
      :disabled="!isEditable"
      ref="form"
      :label-width="isMobile ? '' : '100px'"
      status-icon
    >
      <el-form-item label="Recipient" prop="recipient">
        <el-input v-model="formData.recipient"></el-input>
      </el-form-item>
      <el-form-item label="Date" prop="invoiceDate">
        <el-date-picker v-model="formData.invoiceDate" type="date"></el-date-picker>
      </el-form-item>

      <el-form-item label="Status">
        <el-radio-group v-model="formData.status" :size="isMobile ? 'small' : 'default'">
          <el-radio-button v-for="status in statuses" :key="status.code" :label="status.code">
            {{ status.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="lineItems">
        <el-table class="width-100 mb-2" :data="formData.lineItems">
          <el-table-column label="Items" :width="isMobile ? 150 : 'auto'">
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
          <el-table-column label="Description" :width="isMobile ? 150 : 'auto'">
            <template #default="{ row }">
              <span v-if="row.product.description">{{ row.product.description }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Quantity" :width="isMobile ? 150 : 'auto'">
            <template #default="{ row }">
              <el-input-number
                v-if="row.product.id"
                v-model="row.quantity"
                @change="updateLineItem($event, row)"
                :min="0"
                :size="isMobile ? 'small' : 'default'"
              />
            </template>
          </el-table-column>

          <el-table-column label="Price">
            <template #default="{ row }">
              <span v-if="row.product.unitPrice"> ${{ row.product.unitPrice }} </span>
            </template>
          </el-table-column>

          <el-table-column label="Tax">
            <template #default="{ row }">
              <span v-if="row.product.tax"> {{ row.product.tax * 100 }}% </span>
            </template>
          </el-table-column>

          <el-table-column label="Total">
            <template #default="{ row }">
              <span v-if="row.product.id">${{ row.total }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="isEditable" label="Actions" :width="isMobile ? 80 : 'auto'">
            <template #default="{ row }">
              <el-button @click="removeLineItem(row)" type="danger" :icon="Delete" circle />
            </template>
          </el-table-column>
        </el-table>

        <el-button v-if="isEditable" @click="addLineItem">Add Line Item</el-button>
      </el-form-item>

      <el-form-item>
        <h2>Total: ${{ invoiceTotal }}</h2>
      </el-form-item>

      <el-form-item v-if="isEditable">
        <el-button type="primary" @click="submitForm(form)"> Save Invoice </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style>
@media only screen and (max-width: 767px) {
  .el-form-item {
    display: block;
    margin-bottom: 8px;
  }

  .el-form-item__label {
    display: block;
    width: 100%;
    text-align: left;
  }
}
</style>
