<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue'
import type { TaskItem } from '@/interface/data'
import Icon from '@/components/Icon/index.vue'
import { isToday, isTomorrow, beforeToday, formatTime } from '@/utils/utils'
import { getStaticMenu } from '@/config/menuConfig'
import { useMenuStore } from '@/stores/menu'
import { getIconUrl } from '@/config/iconConfig'
import { useTaskStore } from '@/stores/task'

const props = defineProps<{
  task: TaskItem
  isSelect: boolean
}>()

defineEmits<{
  (event: 'openDetail', task: TaskItem): void
}>()

const menuStore = useMenuStore()

type SubTitleItem = {
  icon?: string
  iconType?: 1 | 2 // 图标类型，1 -> 图片， 2 -> iconfont
  title?: string
  type?: 'warn' | 'primary'
}

const getTime = (t: number) =>
  formatTime(t).format(({ month, day, weekdayZH }) => `${month}月${day}日, 周${weekdayZH}`)

const subtitles = computed(() => {
  const { belongId, onedayExpires, steps, expires, description } = props.task
  let menu = getStaticMenu(belongId)
  const isCustomMenu = !menu
  if (isCustomMenu) menu = menuStore.getCustomMenu(belongId)

  const list: (SubTitleItem | null)[] = [
    // 添加到 我的一天
    isToday(onedayExpires)
      ? {
          icon: 'icon-daytime-mode',
          iconType: 2,
          title: '我的一天'
        }
      : null,
    // 自定义菜单名称
    isCustomMenu
      ? {
          icon: menu?.icon,
          iconType: 1,
          title: menu?.title
        }
      : null,
    // 步骤
    steps.length > 0
      ? {
          title: `第${steps.filter((item) => item.finished).length}步，共${steps.length}步`
        }
      : null,
    // 到期时间
    expires
      ? {
          icon: 'icon-calendar',
          iconType: 2,
          ...(isToday(expires)
            ? // 今天
              {
                title: '今天',
                type: 'primary'
              }
            : beforeToday(expires)
            ? // 过去
              {
                title: getTime(expires),
                type: 'warn'
              }
            : // 明天及以后
              {
                title: isTomorrow(expires) ? '明天' : getTime(expires)
              })
        }
      : null,
    // 是否有备注
    description
      ? {
          icon: 'icon-application-record',
          iconType: 2
        }
      : null
  ]

  return list.filter(Boolean) as SubTitleItem[]
})

const taskStore = useTaskStore()

const changeFinished = () => {
  taskStore.updateTask({ id: props.task.id, finished: !props.task.finished })
}

const changeImportant = () => {
  taskStore.updateTask({ id: props.task.id, isImportant: !props.task.isImportant })
}
</script>

<template>
  <div class="taskitem" :class="{ active: isSelect }">
    <div class="left">
      <Icon
        class="icon"
        :iconfont="task.finished ? 'icon-success-fill' : 'icon-success'"
        @click="changeFinished"
      />
    </div>
    <div class="center" @click="$emit('openDetail', task)">
      <div class="title">{{ task.title }}</div>
      <div class="subtitle">
        <div class="subtitle-item" v-for="(item, index) in subtitles" :class="item.type">
          <Icon class="icon" v-if="item.iconType === 2" :iconfont="item.icon" />
          <Icon class="icon" v-else-if="item.iconType === 1" :picture="getIconUrl(item.icon!)" />
          <p>{{ item.title }}</p>
          <div v-if="index < subtitles.length - 1"></div>
        </div>
      </div>
    </div>
    <div class="right">
      <Icon
        class="icon"
        :iconfont="task.isImportant ? 'icon-favorites-fill' : 'icon-favorites'"
        @click="changeImportant"
      />
    </div>
  </div>
</template>

<style scoped>
.taskitem {
  height: 56px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2px;

  display: flex;
  padding: 0 5px;
}

.taskitem.active,
.taskitem:hover {
  background-color: rgba(255, 255, 255, 0.95);
}

.left {
  width: 40px;
  display: flex;
  justify-content: center;
}

.center {
  flex-grow: 1;
  padding-top: 4px;
}

.center .subtitle {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.center .subtitle-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.center .subtitle-item.primary {
  color: var(--color-primary);
}

.center .subtitle-item.warn {
  color: var(--color-warn);
}

.center .subtitle-item .icon {
  font-size: 12px;
  margin-right: 4px;
  width: 12px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center .subtitle-item div {
  margin: 0 8px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: var(--color-text);
}

.right {
  width: 40px;
  display: flex;
  justify-content: center;
}

.left .icon,
.right .icon {
  font-size: 22px;
}
</style>
