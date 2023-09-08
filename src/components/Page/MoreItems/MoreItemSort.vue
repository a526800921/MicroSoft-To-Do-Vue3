<script setup lang="ts">
import { ref } from 'vue'
import { TaskSortRule } from '@/interface/data'

import More from '../More/More.vue'
import MoreItem from '../More/MoreItem.vue'

const props = withDefaults(
  defineProps<{
    hideItems?: TaskSortRule[]
  }>(),
  {
    hideItems: () => []
  }
)

const emit = defineEmits<{
  (e: 'selectSort', rule: TaskSortRule): void
}>()

const hideOwn = (rule: TaskSortRule) => props.hideItems.findIndex((item) => item === rule) > -1

const own = ref<InstanceType<typeof MoreItem> | null>(null)
const visible = ref(false)

const openMore = () => (visible.value = true)
const closeMore = () => (visible.value = false)

const handleSort = (rule: TaskSortRule) => {
  emit('selectSort', rule)
  closeMore()
}
</script>

<template>
  <MoreItem ref="own" icon="icon-sorting" title="排序依据" useArrow @click="openMore" />
  <More :target="own?.$el" v-model:visible="visible" orientation="left" :offsetX="5" :offsetY="2">
    <MoreItem
      v-if="!hideOwn(TaskSortRule.IMPORTANT)"
      icon="icon-favorites"
      title="重要性"
      @click="handleSort(TaskSortRule.IMPORTANT)"
    />
    <MoreItem
      v-if="!hideOwn(TaskSortRule.EXPIRE_TIME)"
      icon="icon-calendar"
      title="到期日期"
      @click="handleSort(TaskSortRule.EXPIRE_TIME)"
    />
    <MoreItem
      v-if="!hideOwn(TaskSortRule.ONEDAY)"
      icon="icon-daytime-mode"
      title="已添加到“我的一天”"
      @click="handleSort(TaskSortRule.ONEDAY)"
    />
    <MoreItem
      v-if="!hideOwn(TaskSortRule.CREATE_TIME)"
      icon="icon-time-history"
      title="创建日期"
      @click="handleSort(TaskSortRule.CREATE_TIME)"
    />
  </More>
</template>
