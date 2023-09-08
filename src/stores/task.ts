import { ref, computed, isReactive } from 'vue'
import { defineStore } from 'pinia'
import type { TaskItem, ID, TaskStepItem, MenuItem } from '@/interface/data'
import { MenuType, TaskGroupRule } from '@/interface/data'
import { createTaskId } from '@/config/idConfig'
import { getStaticMenuByType } from '@/config/menuConfig'
import { isBoolean, isNull, isNumber, isString } from '@/utils/verify'
import { getToday, isToday, beforeToday, isTomorrow, afterTomorrow } from '@/utils/utils'

// 默认菜单
const defaultMenu = getStaticMenuByType(MenuType.ALL).id

export interface CreateTaskParam {
  title: string
  expires?: TaskItem['expires']
  belongId?: string
  finished?: boolean
}

export interface UpdateTaskParam {
  id: ID
  title?: string
  description?: string
  expires?: TaskItem['expires']
  isImportant?: boolean
  isOneday?: boolean
  finished?: boolean
}

export interface UpdateTaskStepParam {
  index: number
  title?: string
  finished?: boolean
}

export const useTaskStore = defineStore(
  'task',
  () => {
    // 任务列表
    const tasks = ref<TaskItem[]>([])

    // 创建任务
    const createTask = ({
      title,
      expires = null,
      belongId,
      finished = false
    }: CreateTaskParam): ID => {
      const task: TaskItem = {
        id: createTaskId(),
        title,
        description: '',
        expires,
        isImportant: false,
        onedayExpires: isToday(expires) ? getToday() : null,
        finished,
        createTime: Date.now(),
        steps: [],
        belongId: belongId || defaultMenu
      }

      tasks.value.push(task)

      return task.id
    }

    // 更新任务信息
    const updateTask = (param: UpdateTaskParam) => {
      const find = tasks.value.find((item) => item.id === param.id)

      if (!find) return false

      if (param.title) find.title = param.title
      if (isString(param.description)) find.description = param.description
      if (isNumber(param.expires) || isNull(param.expires)) {
        find.expires = param.expires
        if (isToday(param.expires)) find.onedayExpires = param.expires
      }
      if (isBoolean(param.isImportant)) find.isImportant = param.isImportant
      if (isBoolean(param.isOneday)) find.onedayExpires = param.isOneday ? getToday() : null
      if (isBoolean(param.finished)) find.finished = !!param.finished

      return true
    }

    // 删除任务
    const deleteTask = (id: ID) => {
      const index = tasks.value.findIndex((item) => item.id === id)

      if (index === -1) return false

      tasks.value.splice(index, 1)

      return true
    }

    // 修改从属
    const updateTaskBelong = (id: ID, belongId: ID) => {
      const task = tasks.value.find((item) => item.id === id)

      if (!task) return false

      task.belongId = belongId

      return true
    }

    // 添加步骤
    const createTaskStep = (id: ID, title: string) => {
      const task = tasks.value.find((item) => item.id === id)

      if (!task) return false

      task.steps.push({ title, finished: false })

      return true
    }

    // 修改步骤
    const updateTaskStep = (id: ID, param: UpdateTaskStepParam) => {
      const task = tasks.value.find((item) => item.id === id)

      if (!task) return false

      const step = task.steps[param.index]

      if (!step) return false

      if (param.title) step.title = param.title
      if (isBoolean(param.finished)) step.finished = param.finished

      return true
    }

    // 删除步骤
    const deleteTaskStep = (id: ID, index: number) => {
      const task = tasks.value.find((item) => item.id === id)

      if (!task) return false

      task.steps.splice(index, 1)

      return true
    }

    // 将步骤提升为任务
    const promoteTaskStep = (id: ID, index: number, menu: MenuItem) => {
      const task = tasks.value.find((item) => item.id === id)

      if (!task) return false

      const [step] = task.steps.splice(index, 1)

      if (!step) return false

      const newId = createTask({
        title: step.title,
        finished: step.finished,
        belongId: task.belongId
      })
      
      createTaskAfter(newId, menu)

      return true
    }

    // 获取菜单的任务列表
    const getMenuTasks = (menu: MenuItem, searchValue: string = '') => {
      // 我的一天
      if (menu.type === MenuType.ONEDAY)
        return tasks.value.filter((item) => isToday(item.onedayExpires))
      // 重要
      if (menu.type === MenuType.IMPORTANT) return tasks.value.filter((item) => item.isImportant)
      // 计划内
      if (menu.type === MenuType.PLAN) return tasks.value.filter((item) => !!item.expires)
      // 任务
      if (menu.type === MenuType.ALL) return tasks.value.filter((item) => item.belongId === menu.id)
      // 搜索
      if (menu.type === MenuType.SEARCH)
        return tasks.value.filter((item) => !!searchValue && item.title.indexOf(searchValue) > -1)
      // 自定义
      return tasks.value.filter((item) => item.belongId === menu.id)
    }

    // 创建任务之后
    const createTaskAfter = (id: ID, menu: MenuItem) => {
      // 我的一天
      if (menu.type === MenuType.ONEDAY) updateTask({ id, isOneday: true })
      // 重要
      else if (menu.type === MenuType.IMPORTANT) updateTask({ id, isImportant: true })
      // 计划内
      else if (menu.type === MenuType.PLAN) updateTask({ id, expires: getToday() })
    }

    // 删除某个菜单下所有任务
    const deleteTaskByMenu = (menuId: ID) => {
      tasks.value = tasks.value.filter((item) => item.belongId !== menuId)

      return true
    }

    return {
      tasks,
      createTask,
      updateTask,
      deleteTask,
      updateTaskBelong,
      createTaskStep,
      updateTaskStep,
      deleteTaskStep,
      promoteTaskStep,
      getMenuTasks,
      createTaskAfter,
      deleteTaskByMenu
    }
  },
  {
    persist: {
      paths: ['tasks']
    }
  }
)
