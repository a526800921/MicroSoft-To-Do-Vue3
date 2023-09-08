import dayjs from 'dayjs'
import type { RectItem } from '@/interface/public'
import { WeekdayChars } from '@/config/weekConfig'
import { isNumber } from './verify'

// 获取图片地址
export const getImageUrlPng = (name: string) =>
  new URL(`../assets/${name}.png`, import.meta.url).href
export const getImageUrlJpg = (name: string) =>
  new URL(`../assets/${name}.jpg`, import.meta.url).href

// 格式化时间
export const formatTime = (time?: Date | string | number) => {
  time = time ? new Date(time) : new Date()

  const param = {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds(),
    weekday: time.getDay() === 0 ? 7 : time.getDay(),
    weekdayZH: ''
  }

  param.weekdayZH = WeekdayChars[param.weekday]

  return {
    ...param,
    format: (cb: (p: typeof param) => string) => cb(param)
  }
}

// 计算元素位置边界位置信息
export const computedElementPositionBoundary = (
  // 目标定位和节点宽高
  x: number,
  y: number,
  width: number,
  height: number,
  {
    // 边界节点
    boundaryEl = document.body,
    distance = 0
  }: {
    boundaryEl?: HTMLElement
    distance?: number
  } = {}
) => {
  let minX = 0,
    minY = 0
  let { clientWidth: maxX, clientHeight: maxY } = boundaryEl
  let nextX = x,
    nextY = y

  if (distance > 0) {
    minX += distance
    minY += distance
    maxX -= distance
    maxY -= distance
  }

  if (nextX < minX) nextX = minX
  else if (nextX + width > maxX) nextX = maxX - width

  if (nextY < minY) nextY = minY
  else if (nextY + height > maxY) nextY = maxY - width

  return {
    x: nextX,
    y: nextY
  }
}

// 判断目标点是否在指定区域内
export const isPointInRect = (x: number, y: number, rect: RectItem) => {
  const inRect = x >= rect.startX && x <= rect.endX && y >= rect.startY && y <= rect.endY

  return inRect
}

// 今天
const today = dayjs().startOf('day').valueOf()
// 明天
const tomorrow = dayjs().startOf('day').add(1, 'day').valueOf()
export const getToday = () => today
export const getTomorrow = () => tomorrow
export const isToday = (t: unknown): t is number => t === today
export const isTomorrow = (t: unknown): t is number => t === tomorrow
export const beforeToday = (t: unknown): t is number => isNumber(t) && t < today
export const afterTomorrow = (t: unknown): t is number => isNumber(t) && t > tomorrow

// 时间 - 毫秒
export const secondTimeMS = 1000
export const minuteTimeMS = secondTimeMS * 60
export const hourTimeMS = minuteTimeMS * 60
export const dayTimeMS = hourTimeMS * 24
export const weekTimeMS = dayTimeMS * 7

/**
 * 防抖函数
 * @param {Function} cb 需要执行的回调
 * @param {number} timeout 延迟时间
 * @returns 防抖函数，拥有 fn.clear() 方法进行手动清除
 */
export const createDebounce = <T extends (...arg: any[]) => void>(cb: T, timeout = 200) => {
  let timer: number

  const fn = (...arg: Parameters<T>) => {
    fn.clear()
    timer = setTimeout(() => cb(...arg), timeout)
  }

  fn.clear = () => {
    clearTimeout(timer)
  }

  return fn
}
