<script setup lang="ts">
import Page from '@/components/Page/Index.vue'
import { staticSearchMenu } from '@/config/menuConfig'
</script>

<template>
  <div class="search">
    <Page
      :menu="staticSearchMenu"
      :showTop="false"
      :showBottom="false"
    />
  </div>
</template>

<style scoped>
.search {
}
</style>
