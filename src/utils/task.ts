import type { TaskItem } from '@/interface/data'
import { TaskGroupRule, TaskSortRule, SortType } from '@/interface/data'
import { beforeToday, isToday, isTomorrow, afterTomorrow } from './utils'

// 对任务进行分组
const groupTaskRuleBy_UNFINISHED = (ts: TaskItem[]) => ts.filter((item) => !item.finished)
const groupTaskRuleBy_FINISHED = (ts: TaskItem[]) => ts.filter((item) => item.finished)
const groupTaskRuleBy_BEFORE = (ts: TaskItem[]) =>
  ts.filter((item) => !item.finished && beforeToday(item.expires))
const groupTaskRuleBy_TODAY = (ts: TaskItem[]) =>
  ts.filter((item) => isToday(item.onedayExpires) || isToday(item.expires))
const groupTaskRuleBy_TOMORROW = (ts: TaskItem[]) => ts.filter((item) => isTomorrow(item.expires))
const groupTaskRuleBy_AFTER = (ts: TaskItem[]) => ts.filter((item) => afterTomorrow(item.expires))
export const groupTasks = (rule: TaskGroupRule, ts: TaskItem[]) => {
  switch (rule) {
    case TaskGroupRule.UNFINISHED:
      return groupTaskRuleBy_UNFINISHED(ts)
    case TaskGroupRule.FINISHED:
      return groupTaskRuleBy_FINISHED(ts)
    case TaskGroupRule.BEFORE:
      return groupTaskRuleBy_BEFORE(ts)
    case TaskGroupRule.TODAY:
      return groupTaskRuleBy_TODAY(ts)
    case TaskGroupRule.TOMORROW:
      return groupTaskRuleBy_TOMORROW(ts)
    case TaskGroupRule.AFTER:
      return groupTaskRuleBy_AFTER(ts)

    default:
      return ts
  }
}

// 对任务进行排序
const sortTypePm = (sortType: SortType) => (sortType === SortType.DESC ? 1 : -1)
const sortTaskRuleBy_IMPORTANT = (sortType: SortType, ts: TaskItem[]) =>
  ts.slice().sort((a, b) => (+b.isImportant - +a.isImportant) * sortTypePm(sortType))

const sortTaskRuleBy_EXPIRE_TIME = (sortType: SortType, ts: TaskItem[]) =>
  ts
    .slice()
    .sort(
      (a, b) =>
        (Number(b.expires || b.onedayExpires) - Number(a.expires || a.onedayExpires)) *
        sortTypePm(sortType)
    )
const sortTaskRuleBy_ONEDAY = (sortType: SortType, ts: TaskItem[]) =>
  ts
    .slice()
    .sort((a, b) => (Number(b.onedayExpires) - Number(a.onedayExpires)) * sortTypePm(sortType))
const sortTaskRuleBy_CREATE_TIME = (sortType: SortType, ts: TaskItem[]) =>
  ts.slice().sort((a, b) => (b.createTime - a.createTime) * sortTypePm(sortType))
export const sortTasks = (rule: TaskSortRule, ts: TaskItem[], sortType: SortType = SortType.DESC) => {
  switch (rule) {
    case TaskSortRule.IMPORTANT:
      return sortTaskRuleBy_IMPORTANT(sortType, ts)
    case TaskSortRule.EXPIRE_TIME:
      return sortTaskRuleBy_EXPIRE_TIME(sortType, ts)
    case TaskSortRule.ONEDAY:
      return sortTaskRuleBy_ONEDAY(sortType, ts)
    case TaskSortRule.CREATE_TIME:
      return sortTaskRuleBy_CREATE_TIME(sortType, ts)

    default:
      return ts
  }
}
