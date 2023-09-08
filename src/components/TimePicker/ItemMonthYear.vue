<script setup lang="ts">
import type { TimePickerRenderDataItem } from './config'

const props = withDefaults(
  defineProps<{
    data: TimePickerRenderDataItem | null
    select?: boolean // 已经选中的值
    highlight?: boolean // 是否高亮
  }>(),
  {
    data: null,
    select: false,
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
    class="content-item-month-year"
    :class="{
      empty: !data,
      select: select,
      highlight: highlight
    }"
    @click="handleClick"
  >
    <p>{{ data?.title }}</p>
  </div>
</template>

<style scoped>
.content-item-month-year {
  width: 63px;
  height: 63px;
}

.content-item-month-year p {
  width: 62px;
  height: 62px;
  display: block;
  text-align: center;
  line-height: 58px;
  background-color: rgb(242, 242, 242);
  border: 2px solid transparent;
  box-sizing: border-box;
  user-select: none;
}

.content-item-month-year:hover p {
  border-color: rgba(220, 220, 220, 0.6);
}

.content-item-month-year.highlight p {
  background-color: #fff;
}

.content-item-month-year.select p {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

</style>
