export type ID = string

export enum MenuType {
  ONEDAY = 1,
  IMPORTANT,
  PLAN,
  ALL,
  CUSTOM,
  SEARCH
}

export interface MenuItem {
  id: ID
  icon: ID
  title: string
  path: string
  type: MenuType // 菜单类型
}

export interface IconItem {
  id: ID
  url: string
}

export interface ThemeItem {
  id: ID
  type: 'color' | 'pic'
  src: string
}

export interface BackgroundSettingItem {
  id: ID // 菜单id
  themeId: ID // 使用的主题id
}

export interface TaskItem {
  id: ID
  title: string // 标题
  description: string // 描述
  expires: number | null // 到期时间，时间戳 设置为当天的0点，在判断时需要加1天作为结束时间
  isImportant: boolean // 重要
  onedayExpires: number | null // 添加到“我的一天”，时间戳 与 expires 处理一致
  finished: boolean // 完成状态
  createTime: number // 创建时间，时间戳
  steps: TaskStepItem[] // 步骤
  belongId: ID // 菜单ID，从属于哪个菜单分组，默认从属为“任务”菜单
}

export interface TaskStepItem {
  title: string // 标题
  finished: boolean // 完成状态
}

// 任务分组
export enum TaskGroupRule {
  UNFINISHED = '待完成',
  FINISHED = '已完成',
  BEFORE = '先前',
  TODAY = '今天',
  TOMORROW = '明天',
  AFTER = '稍后',
}

export enum SortType {
  DESC = 1,
  ESC
}

// 任务排序
export enum TaskSortRule {
  IMPORTANT = 1, // 重要性
  EXPIRE_TIME, // 到期时间
  ONEDAY, // 已添加到“我的一天”
  CREATE_TIME, // 创建时间
}
