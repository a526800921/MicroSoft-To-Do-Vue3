<script setup lang="ts">
import type { TimePickerRenderDataItem } from './config'

const props = withDefaults(
  defineProps<{
    data: TimePickerRenderDataItem | null
    select?: boolean // 已经选中的值
    active?: boolean // 选择了待确定
    highlight?: boolean // 是否高亮
  }>(),
  {
    data: null,
    select: false,
    active: false,
    highlight: false
  }
)

const emit = defineEmits<{
  (e: 'click', data: TimePickerRenderDataItem): void
}>()

const handleClick = () => {
  if (!props.data) return

  emit('click', props.data)
}
</script>

<template>
  <div
    class="content-item-day"
    :class="{
      empty: !data,
      select: select,
      active: active,
      highlight: highlight
    }"
    @click="handleClick"
  >
    {{ data?.title }}
  </div>
</template>

<style scoped>
.content-item-day {
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 32px;
  background-color: rgb(242, 242, 242);
  border: 2px solid transparent;
  box-sizing: border-box;
  user-select: none;
}

.content-item-day:hover {
  border-color: rgba(220, 220, 220, 0.6);
}

.content-item-day.empty {
  background-color: #fff;
  border-color: transparent;
}

.content-item-day.highlight {
  background-color: #fff;
}

.content-item-day.select {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.content-item-day.active {
  border-color: var(--color-primary);
}

.content-item-day.select.active {
  background-size: 28px 28px;
  background-color: #fff;
  background-repeat: no-repeat;
  background-image: linear-gradient(var(--color-primary), var(--color-primary));
  background-position: center;
}
</style>
