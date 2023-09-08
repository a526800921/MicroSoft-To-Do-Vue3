<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import { getToday, getTomorrow } from '@/utils/utils'

import More from '../More/More.vue'
import MoreItem from '../More/MoreItem.vue'
import MoreLine from '../More/MoreLine.vue'
import TimePicker from '@/components/TimePicker/Index.vue'

const props = withDefaults(
  defineProps<{
    expires: number | null
    showDelete?: boolean
  }>(),
  {
    showDelete: false
  }
)

const emit = defineEmits<{
  (e: 'change', time: number | null): void
}>()

const handleClick = (time: number | null) => {
  emit('change', time)
}

const showTime = () => {
  openMore()
  timePicker.value?.init(props.expires || void 0)
}

const moreTarget = ref<InstanceType<typeof MoreItem> | null>(null)
const moreVisible = ref(false)
const openMore = () => (moreVisible.value = true)
const closeMore = () => (moreVisible.value = false)
const timePicker = ref<InstanceType<typeof TimePicker> | null>(null)
const changeTime = (time: number) => {
  emit('change', time)
  closeMore()
}
</script>

<template>
  <MoreItem icon="icon-daytime-mode" title="今天" @click="handleClick(getToday())" />
  <MoreItem icon="icon-calendar" title="明天" @click="handleClick(getTomorrow())" />
  <MoreItem
    icon="icon-calendar"
    title="下周一"
    @click="handleClick(dayjs().startOf('isoWeek').add(1, 'week').valueOf())"
  />
  <MoreLine />
  <MoreItem ref="moreTarget" icon="icon-calendar" title="选择日期" @click="showTime" />
  <MoreItem
    v-if="showDelete"
    icon="icon-delete"
    title="删除截止日期"
    type="warn"
    @click="handleClick(null)"
  />

  <More
    style="width: initial"
    :target="moreTarget?.$el"
    v-model:visible="moreVisible"
    orientation="top"
  >
    <TimePicker ref="timePicker" @cancel="closeMore" @change="changeTime" />
  </More>
</template>

<style scoped></style>
