<script setup lang="ts">
import type { MenuItem } from '@/interface/data'
import { useRouter } from 'vue-router'
import MoreItem from '../More/MoreItem.vue'
import { useMenuStore } from '@/stores/menu'
import { getStaticMenuByType } from '@/config/menuConfig'
import { MenuType } from '@/interface/data'
import { useTaskStore } from '@/stores/task'

const props = defineProps<{
  menu: MenuItem
}>()

const router = useRouter()
const menuStore = useMenuStore()
const taskStore = useTaskStore()

const handleClick = () => {
  const flag = confirm(`将永久删除“${props.menu.title}”，该菜单内的所有任务将同时删除`)

  if (!flag) return

  // 先切换路由
  // 默认切换到 “我的一天”
  router.replace(getStaticMenuByType(MenuType.ONEDAY).path)

  // 删除该菜单下所有任务
  taskStore.deleteTaskByMenu(props.menu.id)

  // 再删除菜单
  menuStore.deleteCustomMenu(props.menu.id)
}
</script>

<template>
  <MoreItem title="删除列表" icon="icon-delete" type="warn" @click="handleClick" />
</template>
