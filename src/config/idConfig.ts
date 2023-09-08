import type { ID } from '@/interface/data'

const idLength = 32
const now = Date.now()

const createIncrementId = (key: string): (() => ID) => {
  const needLength = idLength - key.length - `${now}`.length - 2

  if (needLength <= 0) throw 'key 过长'

  return () =>
    `${key}_${Date.now()}_${Math.random()
      .toString()
      .substring(2, needLength + 2)
      .padStart(needLength, '0')}` as ID
}

export const createIconId = createIncrementId('icon')
export const createMenuId = createIncrementId('menu')
export const createTodoId = createIncrementId('todo')
export const createResizeObserverId = createIncrementId('ResizeObserver')
export const createMoreDialogId = createIncrementId('MoreDialog')
export const createThemeId = createIncrementId('theme')
export const createTaskId = createIncrementId('task')
export const createTimePickerId = createIncrementId('TimePicker')
