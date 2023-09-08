<script setup lang="ts">
import { ref, computed, watchEffect, nextTick, watch, toRefs } from 'vue'
import type { TaskItem, MenuItem } from '@/interface/data'
import { useTaskStore } from '@/stores/task'
import { formatTime, isToday, isTomorrow, afterTomorrow, beforeToday } from '@/utils/utils'

import Icon from '@/components/Icon/index.vue'
import DetailBox from './DetailBox.vue'
import DetailItem from './DetailItem.vue'
import More from '../More/More.vue'
import MoreItem from '../More/MoreItem.vue'
import MoreLine from '../More/MoreLine.vue'
import MoreItemExpires from '../MoreItems/MoreItemExpires.vue'

const props = defineProps<{
  task: TaskItem | null
  menu: MenuItem
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { task } = toRefs(props)
const ownData = ref<TaskItem | null>(null)

// 保持数据展示
watch(
  task,
  (newV) => {
    if (newV) {
      ownData.value = newV

      // 初始化数据时，更新textarea高度
      nextTick(() => {
        document
          .querySelectorAll('.query-detail-textarea .textarea')
          .forEach((target) => textareaAutoHeight({ target } as any))
      })
    }
  },
  {
    deep: true
  }
)

const taskStore = useTaskStore()

const showDetail = computed(() => !!props.task)
const stepFocus = ref(false)

// textarea自动高度
const textareaAutoHeight = (e: Event) => {
  const target = e.target as HTMLTextAreaElement

  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight}px`
}
// 修改任务完成状态
const changeTaskFinish = () => {
  if (!props.task) return

  taskStore.updateTask({
    id: props.task.id,
    finished: !props.task.finished
  })
}
// 修改任务重要状态
const changeTaskCollect = () => {
  if (!props.task) return

  taskStore.updateTask({
    id: props.task.id,
    isImportant: !props.task.isImportant
  })
}
// 修改任务标题
const changeTaskTitle = (e: Event) => {
  if (!props.task) return

  const target = e.target as HTMLTextAreaElement

  target.blur()

  const value = target.value

  if (!value) {
    target.value = props.task.title
    textareaAutoHeight(e)
    return
  }

  taskStore.updateTask({
    id: props.task.id,
    title: value
  })
}
// 删除任务
const deleteTask = () => {
  if (!props.task) return

  const flag = confirm(`将永久删除任务“${props.task.title}”`)

  if (!flag) return

  emit('close')
  taskStore.deleteTask(props.task.id)
}
// 添加到“我的一天”
const changeToday = () => {
  if (!props.task) return

  taskStore.updateTask({
    id: props.task.id,
    isOneday: isToday(props.task.onedayExpires) ? false : true
  })
}

// 添加步骤
const addStep = (e: KeyboardEvent) => {
  if (!props.task) return

  const target = e.target as HTMLTextAreaElement

  const value = target.value

  if (!value) return

  taskStore.createTaskStep(props.task.id, value)

  target.value = ''
  textareaAutoHeight(e)
  target.blur()
}
// 更新步骤标题
const updateStepTitle = (e: Event, index: number) => {
  if (!props.task) return
  const target = e.target as HTMLTextAreaElement

  target.blur()

  const value = target.value

  if (!value) {
    // 询问是否删除
    const flag = confirm('是否删除该步骤？')

    if (flag) taskStore.deleteTaskStep(props.task.id, index)
    // 需要还原数值
    else {
      target.value = props.task.steps[index].title
      textareaAutoHeight(e)
    }

    return
  }

  taskStore.updateTaskStep(props.task.id, {
    index,
    title: value
  })
}
// 更新步骤完成状态
const updateStepFinish = (index: number) => {
  if (!props.task) return

  taskStore.updateTaskStep(props.task.id, {
    index,
    finished: !props.task.steps[index].finished
  })
}
// 步骤 - 更多弹窗
const moreIndex = ref(-1)
const moreTarget = ref<HTMLElement | null>(null)
const moreVisible = ref(false)
const moreStepItem = computed(() => props.task?.steps[moreIndex.value])
const openMore = (e: Event, index: number) => {
  moreIndex.value = index
  moreTarget.value = e.target as HTMLElement
  moreVisible.value = true
}
const closeMore = (v: boolean = false) => {
  if (!v) {
    moreIndex.value = -1
    moreTarget.value = null
    moreVisible.value = false
  }
}
// 修改完成状态
const moreUpdateStepFinish = () => {
  updateStepFinish(moreIndex.value)
  closeMore()
}
// 提升为任务
const morePromoteStep = () => {
  if (!props.task) return

  taskStore.promoteTaskStep(props.task.id, moreIndex.value, props.menu)
  closeMore()
}
// 删除步骤
const moreDeleteStep = () => {
  if (!props.task) return

  const flag = confirm('是否删除该步骤？')

  if (flag) {
    taskStore.deleteTaskStep(props.task.id, moreIndex.value)
    closeMore()
  }
}

// 添加截止日期 - 弹窗
const expiresMoreTarget = ref<InstanceType<typeof DetailItem> | null>(null)
const expiresMoreVisible = ref(false)
const openExpiresMore = () => (expiresMoreVisible.value = true)
const closeExpiresMore = () => (expiresMoreVisible.value = false)
const expiresDetailItemData = computed<{
  title: string
  type?: 'primary' | 'warn'
}>(() => {
  let title = '添加截止日期'
  let type: 'primary' | 'warn' | undefined = void 0

  if (props.task) {
    const { expires } = props.task

    if (isToday(expires)) {
      title = '今天 到期'
      type = 'primary'
    } else if (isTomorrow(expires)) {
      title = '明天 到期'
      type = 'primary'
    } else if (afterTomorrow(expires)) {
      title = formatTime(expires).format(
        ({ month, day, weekdayZH }) => `${month}月${day}日, 周${weekdayZH} 到期`
      )
      type = 'primary'
    } else if (beforeToday(expires)) {
      title = formatTime(expires).format(
        ({ month, day, weekdayZH }) => `${month}月${day}日, 周${weekdayZH} 到期`
      )
      type = 'warn'
    }
  }

  return {
    title,
    type
  }
})
// 修改截止时间
const expiresMoreChangeExpires = (time: number | null) => {
  if (!props.task) return

  taskStore.updateTask({
    id: props.task.id,
    expires: time
  })
  closeExpiresMore()
}
</script>

<template>
  <div
    class="detail"
    :style="{
      width: `${showDetail ? 360 : 0}px`
    }"
  >
    <div class="detail-content" v-if="!!ownData">
      <div class="top">
        <Icon class="icon" iconfont="icon-close" @click="emit('close')" />
      </div>
      <div class="center query-detail-textarea">
        <DetailBox>
          <div class="title">
            <Icon
              class="icon-finish"
              :iconfont="ownData.finished ? 'icon-success-fill' : 'icon-success'"
              @click="changeTaskFinish"
            />
            <textarea
              class="textarea"
              :value="ownData.title"
              rows="1"
              @input="textareaAutoHeight"
              @change="changeTaskTitle"
              @keydown.enter.prevent="changeTaskTitle"
            />
            <Icon
              class="icon-collect"
              :iconfont="ownData.isImportant ? 'icon-favorites-fill' : 'icon-favorites'"
              @click="changeTaskCollect"
            />
          </div>
          <div
            class="step"
            :class="{ finished: item.finished }"
            v-for="(item, index) in ownData.steps"
          >
            <Icon
              class="icon-finish"
              :iconfont="item.finished ? 'icon-success-fill' : 'icon-success'"
              @click="updateStepFinish(index)"
            />
            <textarea
              class="textarea"
              :value="item.title"
              rows="1"
              @input="textareaAutoHeight"
              @change="(e) => updateStepTitle(e, index)"
              @keydown.enter.prevent="(e) => updateStepTitle(e, index)"
            />
            <Icon
              class="icon-more"
              :rotate="90"
              iconfont="icon-more"
              @click="(e) => openMore(e, index)"
            />
          </div>
          <div class="step" :class="{ primary: !stepFocus }">
            <Icon class="icon-finish" iconfont="icon-success" />
            <textarea
              class="textarea"
              rows="1"
              :placeholder="stepFocus ? '' : '下一步'"
              @input="textareaAutoHeight"
              @focus="stepFocus = true"
              @blur="stepFocus = false"
              @keydown.enter.prevent="addStep"
            />
          </div>

          <More :target="moreTarget" :visible="moreVisible" @update:visible="closeMore">
            <template v-if="!!moreStepItem">
              <template v-if="moreStepItem.finished">
                <MoreItem icon="icon-success" title="标记为未完成" @click="moreUpdateStepFinish" />
              </template>
              <template v-else>
                <MoreItem
                  icon="icon-success-fill"
                  title="标记为已完成"
                  @click="moreUpdateStepFinish"
                />
                <MoreItem icon="icon-add" title="提升为任务" @click="morePromoteStep" />
              </template>
              <MoreLine />
              <MoreItem icon="icon-delete" title="删除步骤" type="warn" @click="moreDeleteStep" />
            </template>
          </More>
        </DetailBox>

        <DetailBox>
          <DetailItem
            v-if="isToday(ownData.onedayExpires)"
            icon="icon-daytime-mode"
            title="已添加到“我的一天”"
            type="primary"
            show-clear
            @clear="changeToday"
          />

          <DetailItem
            v-else
            icon="icon-daytime-mode"
            title="添加到“我的一天”"
            @click="changeToday"
          />
        </DetailBox>

        <DetailBox>
          <DetailItem
            ref="expiresMoreTarget"
            icon="icon-calendar"
            :title="expiresDetailItemData.title"
            :type="expiresDetailItemData.type"
            :show-clear="!!ownData.expires"
            @click="openExpiresMore"
            @clear="expiresMoreChangeExpires(null)"
          />

          <More :target="expiresMoreTarget?.$el" v-model:visible="expiresMoreVisible">
            <MoreItemExpires @change="expiresMoreChangeExpires" :expires="ownData.expires" />
          </More>
        </DetailBox>

        <DetailBox>
          <textarea
            class="textarea description"
            rows="2"
            placeholder="添加备注"
            @input="textareaAutoHeight"
          />
        </DetailBox>
      </div>
      <div class="bottom">
        <p>
          创建于
          {{
            formatTime(ownData.createTime).format(
              ({ month, day, weekdayZH }) => `${month}月${day}日，周${weekdayZH}`
            )
          }}
        </p>
        <Icon class="icon" iconfont="icon-delete" @click="deleteTask" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail {
  height: 100%;
  overflow: hidden;
  transition: width 0.2s;
}

.detail-content {
  width: 360px;
  height: 100%;
  flex-shrink: 0;
  background-color: rgba(250, 250, 250, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
}

.top {
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.top .icon {
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-right: 15px;
}

.top .icon:hover {
  background-color: rgb(233, 233, 233);
}

.center {
  flex-grow: 1;
  overflow: auto;
  padding: 10px 15px;
}

.bottom {
  height: 50px;
  flex-shrink: 0;
  border-top: 1px solid rgb(236, 236, 236);
  display: flex;
}

.bottom p {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom .icon {
  height: 100%;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.bottom .icon:hover {
  background-color: rgb(233, 233, 233);
}

.textarea {
  display: block;
  width: 100%;
  border: 0;
  background-color: transparent;
  outline: none;
  resize: none;
}

.description {
  margin: 12px;
  width: calc(100% - 24px);
  font-size: 14px;
}

.title {
  display: flex;
  padding: 15px 0;
}

.title .icon-finish,
.title .icon-collect {
  height: 30px;
  width: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.title .textarea {
  flex-grow: 1;
  font-size: 20px;
  font-weight: bold;
}

.step {
  display: flex;
  align-items: center;
  margin: 0 4px;
  padding: 8px 0;
}

.step:hover {
  background-color: rgb(247, 247, 247);
}

.step.finished .textarea {
  text-decoration: line-through;
}

.primary {
  color: var(--color-primary);
}

.primary .textarea::placeholder {
  color: var(--color-primary);
}

.step .icon-finish,
.step .icon-more {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.step .icon-finish {
  width: 40px;
  position: relative;
  top: 2px;
}

.step .icon-more {
  width: 36px;
  height: 32px;
}

.step .icon-more:hover {
  background-color: rgb(233, 233, 233);
}

.step .textarea {
  font-size: 14px;
  margin-right: 4px;
}
</style>
