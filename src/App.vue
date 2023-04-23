<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <el-container>
    <el-header>
      <RouterLink to="/">
        <img alt="Vue logo" class="logo" src="@/assets/amdocs-logo.png" width="160" height="35" />
      </RouterLink>
    </el-header>

    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  background-color: #131318;
}
</style>
