<script setup lang="ts">
import Page from '@/components/Page/Index.vue'
import { getStaticMenuByType } from '@/config/menuConfig'
import { MenuType, TaskSortRule } from '@/interface/data'

const menu = getStaticMenuByType(MenuType.ONEDAY)
</script>

<template>
  <div class="oneday">
    <Page
      :menu="menu"
      showTime
      :showIcon="false"
      :showSuggest="false"
      :hideMoreSortItems="[TaskSortRule.ONEDAY]"
    />
  </div>
</template>

<style scoped>
.oneday {
}
</style>
