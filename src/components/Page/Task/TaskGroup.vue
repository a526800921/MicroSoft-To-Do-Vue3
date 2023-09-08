<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TaskItem } from '@/interface/data'
import Icon from '@/components/Icon/index.vue'
import TaskItemNode from './TaskItem.vue'

const props = defineProps<{
  title?: string
  tasks: TaskItem[]
  selectTask: TaskItem | null
}>()

defineEmits<{
  (event: 'openDetail', task: TaskItem): void
}>()

const spread = ref(true)
const list = computed<TaskItem[]>(() => (spread.value ? props.tasks : []))
</script>

<template>
  <div class="taskgroup" v-show="tasks.length > 0">
    <div class="title" v-if="!!title" @click="spread = !spread">
      <Icon class="icon" :class="{ rotate: spread }" iconfont="icon-right" />
      <p>{{ title }}</p>
      <span>{{ tasks.length }}</span>
    </div>

    <TransitionGroup name="list">
      <TaskItemNode
        v-for="task in list"
        :task="task"
        :key="task.id"
        @open-detail="(task) => $emit('openDetail', task)"
        :is-select="selectTask?.id === task.id"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.taskgroup {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
}

.taskgroup .title {
  height: 30px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  display: flex;
  align-items: center;
  align-self: flex-start;
  padding: 0 10px 0 6px;
  user-select: none;
  margin-bottom: 10px;
}

.taskgroup .icon {
  position: relative;
  top: 2px;
  transform: rotate(0deg);
  transition: transform 0.2s;
}

.taskgroup .icon.rotate {
  transform: rotate(90deg);
}

.taskgroup .title p {
  margin: 0 10px 0 8px;
}
</style>
