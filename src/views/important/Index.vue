<script setup lang="ts">
import Page from '@/components/Page/Index.vue'
import { getStaticMenuByType } from '@/config/menuConfig'
import { MenuType, TaskSortRule } from '@/interface/data'

const menu = getStaticMenuByType(MenuType.IMPORTANT)
</script>

<template>
  <div class="important">
    <Page :menu="menu" :hideMoreSortItems="[TaskSortRule.IMPORTANT]" />
  </div>
</template>

<style scoped>
.important {
}
</style>
