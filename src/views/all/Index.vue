<script setup lang="ts">
import Page from '@/components/Page/Index.vue'
import { getStaticMenuByType } from '@/config/menuConfig'
import { MenuType } from '@/interface/data'

const menu = getStaticMenuByType(MenuType.ALL)
</script>

<template>
  <div class="all">
    <Page :menu="menu" />
  </div>
</template>

<style scoped>
.all {
}
</style>
