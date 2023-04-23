<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <el-container>
    <el-header height="80px">
      <RouterLink to="/invoices">
        <img
          alt="Vue logo"
          class="logo"
          src="@/assets/images/amdocs-logo.png"
          width="160"
          height="35"
        />
      </RouterLink>
    </el-header>

    <el-main>
      <RouterView />

      <el-backtop :right="10" :bottom="20" />
    </el-main>
  </el-container>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  background: #131318 url('./assets/images/dancer-new-lg.jpg') 50% no-repeat;
}
</style>
