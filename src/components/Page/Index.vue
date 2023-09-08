<script setup lang="ts">
import { ref, watchEffect, computed, watch, reactive, nextTick } from 'vue'
import { formatTime, getToday, isToday, isTomorrow } from '@/utils/utils'
import { useSettingStore } from '@/stores/setting'
import { useTaskStore } from '@/stores/task'
import Icon from '@/components/Icon/index.vue'
import type { TaskItem, MenuItem } from '@/interface/data'
import { TaskGroupRule, TaskSortRule, SortType } from '@/interface/data'
import { getIconUrl, Icons } from '@/config/iconConfig'
import { groupTasks, sortTasks } from '@/utils/task'
import { useAppStore } from '@/stores/app'
import { useMenuStore } from '@/stores/menu'

import More from './More/More.vue'
import MoreItemSort from './MoreItems/MoreItemSort.vue'
import MoreItemTheme from './MoreItems/MoreItemTheme.vue'
import MoreItemDelete from './MoreItems/MoreItemDelete.vue'
import TaskGroup from './Task/TaskGroup.vue'
import Detail from './Detail/Detail.vue'
import MoreItemExpires from './MoreItems/MoreItemExpires.vue'

const props = withDefaults(
  defineProps<{
    menu: MenuItem
    showTop?: boolean // 展示标题栏
    showTime?: boolean // 标题栏的时间
    showIcon?: boolean // 标题栏的icon
    showSuggest?: boolean // 标题栏的建议
    taskGroupRule?: TaskGroupRule[] // 任务分组规则
    isCustomMenu?: boolean // 是否是自定义菜单
    showMoreSort?: boolean // 更多弹窗中是否展示排序
    hideMoreSortItems?: TaskSortRule[] // 更多弹窗中需要隐藏的排序规则
    showMoreDelete?: boolean // 更多弹窗中是否展示删除
    showBottom?: boolean // 展示底部功能区
  }>(),
  {
    showTop: true,
    showTime: false,
    showIcon: true,
    showSuggest: false,
    taskGroupRule: () => [TaskGroupRule.UNFINISHED, TaskGroupRule.FINISHED],
    isCustomMenu: false,
    showMoreSort: true,
    hideMoreSortItems: () => [],
    showMoreDelete: false,
    showBottom: true
  }
)

const appStore = useAppStore()

const titleIcon = computed(() =>
  props.isCustomMenu ? getIconUrl(props.menu.icon) : props.menu.icon
)

// 背景图
const settingStore = useSettingStore()
const background = computed(() => settingStore.getBackgroundSetting(props.menu.id))
// 动画切换
const bgChangeTransition = ref(false)
watch(background, () => {
  bgChangeTransition.value = !bgChangeTransition.value
})

// 更多弹窗
const moreVisible = ref(false)
const moreTarget = ref<InstanceType<typeof Icon> | null>(null)
const openMore = () => (moreVisible.value = true)
const closeMore = () => (moreVisible.value = false)

// 任务
const taskStore = useTaskStore()
// 排序
const selectSort = ref<TaskSortRule | null>(null)
const selectSortType = ref<SortType>(SortType.DESC)
const handleSortType = () =>
  (selectSortType.value = selectSortType.value === SortType.DESC ? SortType.ESC : SortType.DESC)
// 当前页面的任务
const tasks = computed(() => taskStore.getMenuTasks(props.menu, appStore.searchValue))
// 分组后的任务
const tsakGroups = computed(() =>
  props.taskGroupRule.map((rule) => ({
    title: rule,
    tasks: selectSort.value
      ? sortTasks(selectSort.value, groupTasks(rule, tasks.value), selectSortType.value)
      : groupTasks(rule, tasks.value)
  }))
)

// 选择排序方式
const handleSort = (sort: TaskSortRule) => {
  selectSort.value = sort
  // 隐藏弹窗
  closeMore()
}
const closeSort = () => {
  selectSort.value = null
}
const renderSortTitle = computed(() => {
  switch (selectSort.value) {
    case TaskSortRule.IMPORTANT:
      return '重要性'
    case TaskSortRule.EXPIRE_TIME:
      return '截止日期'
    case TaskSortRule.ONEDAY:
      return '是否添加到“我的一天”'
    case TaskSortRule.CREATE_TIME:
      return '创建日期'

    default:
      return ''
  }
})

// 选中状态
const selectTask = ref<TaskItem | null>(null)
// 打开/关闭任务详情
const openDetail = (task: TaskItem) => {
  if (selectTask.value?.id === task.id) selectTask.value = null
  else selectTask.value = task
}

// 任务到期时间选择
const expires = ref<number | null>(null)
const expiresTarget = ref<HTMLElement | null>(null)
const expiresVisible = ref(false)
const openExpiresVisible = () => (expiresVisible.value = true)
const closeExpiresVisible = () => (expiresVisible.value = false)
const expiresDesc = computed(() => {
  const time = expires.value

  if (!time) return ''
  if (isToday(time)) return '今天'
  if (isTomorrow(time)) return '明天'
  return formatTime(time).format(
    ({ month, day, weekdayZH }) => `${month}月${day}日, 周${weekdayZH}`
  )
})
const expiresChangeExpires = (time: number | null) => {
  expires.value = time

  closeExpiresVisible()
}
// 添加任务
const createTask = (e: KeyboardEvent) => {
  const target = e.target as HTMLInputElement
  const value = target.value

  if (!value) return

  const id = taskStore.createTask({
    title: value,
    expires: expires.value,
    belongId: props.isCustomMenu ? props.menu.id : void 0
  })

  // 修改对应任务的状态，例如在“我的一天”创建的任务需要添加到“我的一天”
  if (!props.isCustomMenu) taskStore.createTaskAfter(id, props.menu)

  target.value = ''
  expires.value = null
}

const menuStore = useMenuStore()

// 自定义icon
const IconMoreTarget = ref<InstanceType<typeof Icon> | null>(null)
const IconMoreVisible = ref(false)
const openIconMore = () => (IconMoreVisible.value = true)
const closeIconMore = () => (IconMoreVisible.value = false)
const changeMenuIcon = (iconId: string) => {
  menuStore.updateCustomMenu({
    id: props.menu.id,
    icon: iconId
  })
}

// 自定义标题
const editTitleInput = ref<HTMLInputElement | null>(null)
const editTitleVisible = ref(false)
const openEditTitle = () => {
  if (!props.isCustomMenu) return
  editTitleVisible.value = true

  nextTick(() => editTitleInput.value?.focus())
}
const changeTitle = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value

  editTitleVisible.value = false
  
  if (!value) return

  menuStore.updateCustomMenu({
    id: props.menu.id,
    title: value
  })
}
</script>

<template>
  <div class="page">
    <div class="bg">
      <Transition name="page">
        <img v-if="background.type === 'pic' && bgChangeTransition" :src="background.src" alt="" />
        <img
          v-else-if="background.type === 'pic' && !bgChangeTransition"
          :src="background.src"
          alt=""
        />
        <div
          class="bg-color"
          v-else-if="background.type === 'color' && bgChangeTransition"
          :style="{ backgroundImage: background.src }"
        ></div>
        <div
          class="bg-color"
          v-else-if="background.type === 'color' && !bgChangeTransition"
          :style="{ backgroundImage: background.src }"
        ></div>
      </Transition>
    </div>

    <div class="content-list">
      <div class="top" v-if="showTop">
        <div class="t-left">
          <div class="title">
            <template v-if="showIcon">
              <Icon
                v-if="isCustomMenu"
                class="title-icon"
                :picture="titleIcon"
                ref="IconMoreTarget"
                @click="openIconMore"
              />
              <Icon v-else class="title-icon" :iconfont="titleIcon" />
            </template>
            <p v-if="!editTitleVisible" @click="openEditTitle">{{ menu.title }}</p>
            <input
              v-else
              ref="editTitleInput"
              type="text"
              :value="menu.title"
              @blur="changeTitle"
              @keydown.enter="changeTitle"
            />

            <More
              :target="IconMoreTarget?.$el"
              v-model:visible="IconMoreVisible"
              style="width: initial"
            >
              <div class="iconlist">
                <div class="iconbox" v-for="icon in Icons">
                  <Icon
                    class="icon"
                    :class="{ select: menu.icon === icon.id }"
                    :picture="icon.url"
                    @click="changeMenuIcon(icon.id)"
                  />
                </div>
              </div>
            </More>
          </div>

          <div class="subtitle" v-if="showTime">
            {{
              formatTime().format(
                ({ month, day, weekdayZH }) => `${month}月${day}日，星期${weekdayZH}`
              )
            }}
          </div>
        </div>

        <div class="t-right">
          <Icon
            v-if="showSuggest"
            class="right-icon"
            :class="{ active: false }"
            iconfont="icon-chengchangzhiyin"
          />
          <Icon ref="moreTarget" class="right-icon unbg" iconfont="icon-more" @click="openMore" />

          <More :target="moreTarget?.$el" v-model:visible="moreVisible" :offsetY="10">
            <MoreItemSort
              v-if="showMoreSort"
              @select-sort="handleSort"
              :hide-items="hideMoreSortItems"
            />
            <MoreItemTheme :menu="menu" />
            <MoreItemDelete :menu="menu" v-if="showMoreDelete" />
          </More>
        </div>
      </div>

      <div class="sort" v-if="!!selectSort">
        <div class="sort-content" @click="handleSortType">
          <Icon
            class="icon"
            iconfont="icon-down-arrow"
            :style="{
              transform: `rotate(${selectSortType === SortType.DESC ? 0 : -180}deg)`
            }"
          />
          <p>按{{ renderSortTitle }}排序</p>
        </div>
        <div class="sort-close" @click="closeSort">
          <Icon iconfont="icon-close" />
        </div>
      </div>

      <div class="content">
        <TaskGroup
          v-for="group in tsakGroups"
          :key="group.title"
          :title="group.title"
          :tasks="group.tasks"
          @open-detail="openDetail"
          :select-task="selectTask"
        />
      </div>

      <div class="bottom" v-if="showBottom">
        <div class="bottom-input">
          <Icon class="add-icon" iconfont="icon-add" />
          <input class="input" type="text" @keydown.enter="createTask" />
          <div class="other" ref="expiresTarget" @click="openExpiresVisible">
            <Icon class="other-icon" iconfont="icon-calendar" />
            <p v-if="expires">{{ expiresDesc }}</p>
          </div>
        </div>

        <More :target="expiresTarget" v-model:visible="expiresVisible" orientation="top">
          <MoreItemExpires
            @change="expiresChangeExpires"
            :expires="expires"
            :showDelete="!!expires"
          />
        </More>
      </div>
    </div>

    <Detail :menu="menu" :task="selectTask" @close="selectTask = null" />
  </div>
</template>

<style scoped>
.page {
  height: 100vh;
  position: relative;
  z-index: 0;
  display: flex;
}

.bg {
  position: absolute;
  z-index: -1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  border-top-left-radius: 12px;
}

.bg img {
  display: block;
  min-width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.bg .bg-color {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.content-list {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.top {
  display: flex;
  justify-content: space-between;
  padding: 40px 40px 0 40px;
  flex-shrink: 0;
  margin-bottom: 20px;
}

.t-left {
}

.t-right {
  height: 30px;
  display: flex;
  align-items: center;
}

.title {
  display: flex;
  align-items: center;
  color: #fff;
}

.title-icon {
  width: 26px;
  height: 26px;
  margin: 0 7px;
  font-size: 26px;
  display: flex;
  align-items: center;
  position: relative;
  top: 2px;
}

.iconlist {
  width: 200px;
  display: flex;
  flex-wrap: wrap;
}

.iconlist .iconbox {
  width: 25%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.iconlist .icon {
  width: 44px;
  height: 44px;
  border: 2px solid transparent;
}

.iconlist .icon:hover {
  border-color: rgb(246, 246, 246);
}

.iconlist .icon.select {
  border-color: var(--color-primary);
}

.title p {
  font-size: 30px;
  line-height: 1;
  height: 30px;
  font-weight: bold;
}

.title input {
  font-size: 30px;
  line-height: 42px;
  height: 42px;
  margin-top: -6px;
  margin-bottom: -6px;
  border-radius: 6px;
  padding: 0 5px;
  font-weight: bold;
  border: 0;
  outline: none;
  width: 300px;
}

.subtitle {
  font-size: 16px;
  line-height: 1;
  margin-top: 10px;
  color: #fff;
}

.right-icon {
  height: 30px;
  width: 30px;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  border-radius: 4px;
  margin-left: 20px;
  cursor: pointer;
}

.right-icon.active,
.right-icon:hover {
  background-color: rgba(255, 255, 255, 1);
}

.right-icon.unbg {
  color: #fff;
  background-color: transparent;
}

.right-icon.unbg:hover {
  background-color: rgba(255, 255, 255, 0.6);
}

.sort {
  margin-bottom: 5px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-left: 40px;
}

.sort-content {
  height: 32px;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 8px 0 6px;
  margin-right: 10px;
  user-select: none;
}

.sort-content:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.sort-content .icon {
  transition: transform 0.2s;
}

.sort-content p {
  margin-left: 8px;
}

.sort-close {
  height: 32px;
  background-color: rgba(255, 255, 255, 0.75);
  border-radius: 4px;
  padding: 0 6px;
  display: flex;
  align-items: center;
}

.sort-close:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.content {
  padding: 0 40px;
  flex-grow: 1;
  overflow: auto;
}

.bottom {
  height: 100px;
  padding: 10px 40px 0;
  flex-shrink: 0;
}

.bottom-input {
  height: 48px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
}

.bottom-input:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.bottom .add-icon {
  width: 48px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom .input {
  flex-grow: 1;
  font-size: 18px;
  height: 100%;
  background-color: transparent;
  border: 0;
  outline: none;
}

.bottom .other {
  border-radius: 4px;
  margin-right: 2px;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  user-select: none;
}

.bottom .other:hover {
  background-color: #fff;
}

.bottom .other-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  position: relative;
  top: 1px;
}

.bottom .other p {
  margin-left: 4px;
}
</style>
