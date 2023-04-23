<template>
  <h1>You are in {{ route.params.mode }} mode</h1>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss" scoped></style>
