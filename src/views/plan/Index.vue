<script setup lang="ts">
import Page from '@/components/Page/Index.vue'
import { getStaticMenuByType } from '@/config/menuConfig'
import { MenuType, TaskGroupRule } from '@/interface/data'

const menu = getStaticMenuByType(MenuType.PLAN)
const groupRules = [
  TaskGroupRule.BEFORE,
  TaskGroupRule.TODAY,
  TaskGroupRule.TOMORROW,
  TaskGroupRule.AFTER
]
</script>

<template>
  <div class="plan">
    <Page :menu="menu" :task-group-rule="groupRules" :showMoreSort="false" />
  </div>
</template>

<style scoped>
.plan {
}
</style>
