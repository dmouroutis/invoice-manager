<script setup>
import PageContainer from '../components/PageContainer.vue'
import InvoicesListing from '../components/Invoices/InvoicesListing.vue'
</script>

<template>
  <PageContainer>
    <el-card class="mb-2">
      <div class="d-flex align-center justify-space-between">
        <h2>Invoices</h2>

        <RouterLink to="/invoice/create">
          <el-button type="primary">New Invoice</el-button>
        </RouterLink>
      </div>
    </el-card>

    <InvoicesListing />
  </PageContainer>
</template>
