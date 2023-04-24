<script setup>
import { useRoute } from 'vue-router'
import PageContainer from '../components/PageContainer.vue'
import InvoiceManager from '../components/Invoices/InvoiceManager.vue'

const route = useRoute()

const mode = route.params.mode
const invoiceID = parseInt(route.params.id)
</script>

<template>
  <PageContainer>
    <InvoiceManager :mode="mode" :id="invoiceID" />
  </PageContainer>
</template>
