<script setup lang="ts">
import { ref, computed, watchPostEffect, nextTick, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import { weekHeads } from '@/config/weekConfig'
import type {
  TimePickerGridOptions,
  TimePickerRenderDataItem,
  TimePickerRenderDataItems
} from './config'
import { TimePickerType, typeToGrid } from './config'
import { useResizeObserver } from '@/use/ResizeObserver'
import { getToday, dayTimeMS, formatTime } from '@/utils/utils'
import { createTimePickerId } from '@/config/idConfig'

import Icon from '@/components/Icon/index.vue'
import ItemDay from './ItemDay.vue'
import ItemMonthYear from './ItemMonthYear.vue'

const emit = defineEmits<{
  (e: 'change', time: number): void
  (e: 'cancel'): void
}>()

// 日期组件思路
// 通过固定前后100年的时间差，固定的日期节点高度，计算出节点容器的总高度 scrollHeight
// 滚动容器的每一个 scrollTop 都能有对应的日期 第几周、第几月、第几年
// 在节点容器中渲染一定数量的日期行节点，绝对定位，按序覆盖滚动容器的窗口，在滚动的时候修改每行的 top 及内容
// 即可达到类似无限滚动的效果
const id = createTimePickerId()

const getGrid = (type: TimePickerType) => typeToGrid[type]

// 当前选择的展示类型
const currentType = ref<TimePickerType>(TimePickerType.DAY)
const currentGrid = computed(() => getGrid(currentType.value))

// 前后100年时间
const year = dayjs().startOf('year')
const yearBefore100 = dayjs().startOf('year').subtract(100, 'year')
const yearAfter100 = dayjs().startOf('year').add(101, 'year')
// 年份差 200年
const diffYear100Year = yearAfter100.year() - yearBefore100.year()
// 月份差 2400个月
const diffYear100Month = diffYear100Year * 12
// 毫秒差
const diffYear100MS = yearAfter100.valueOf() - yearBefore100.valueOf()
// 当前100年的1月1日不是星期一时，需要填充之前的时间
const diffYearBeforeFill = (yearBefore100.isoWeekday() - 1) * dayTimeMS
// 第一行的开始时间，不是第一天
const yearBefore100FirstTime = yearBefore100.valueOf() - diffYearBeforeFill
// 最后一天的结束时间
const yearAfter100LastTime = yearAfter100.valueOf()
// 一共多少行
const maxRowNumber = computed(() => {
  const { col } = currentGrid.value

  switch (currentType.value) {
    // 展示类型为天的时候每行是一周，计算行数时需要加上填充的数据
    case TimePickerType.DAY:
      return Math.ceil((diffYear100MS + diffYearBeforeFill) / (dayTimeMS * col))
    case TimePickerType.MONTH:
      return Math.ceil(diffYear100Month / col)
    case TimePickerType.YEAR:
      return Math.ceil(diffYear100Year / col)

    default:
      return 0
  }
})

// 时间区域渲染所使用的时间节点
const contentItemDayNode = ref<InstanceType<typeof ItemDay> | null>(null)
const contentItemMonthYearNode = ref<InstanceType<typeof ItemMonthYear> | null>(null)
const contentItemNode = computed<HTMLElement | null>(() => {
  // 根据展示类型使用不同节点
  switch (currentType.value) {
    // 展示类型为天的时候
    case TimePickerType.DAY:
      return contentItemDayNode.value?.$el
    case TimePickerType.MONTH:
      return contentItemMonthYearNode.value?.$el
    case TimePickerType.YEAR:
      return contentItemMonthYearNode.value?.$el

    default:
      return null
  }
})
// 监听节点获取高度
const contentItemNodeSize = useResizeObserver(contentItemNode)
// 内容节点宽度高度
const contentNodeSize = computed(() => ({
  height: contentItemNodeSize.fullHeight * maxRowNumber.value,
  width: contentItemNodeSize.fullWidth * currentGrid.value.col
}))
// 滚动节点
const scrollNode = ref<HTMLDivElement | null>(null)
// 滚动节点高度
const scrollNodeHeight = computed(() => contentItemNodeSize.fullHeight * currentGrid.value.row)

// 需要展示的数据行数
const contentRowNumber = computed(() => currentGrid.value.row * 3)
// 渲染数据行
const dataList = ref<TimePickerRenderDataItems[]>([])

// 通过时间获取所在行数
const getRowByTime = (time: number, type: TimePickerType = currentType.value): number => {
  const { col } = getGrid(type)

  if (type === TimePickerType.DAY) {
    // 计算时间差
    const diff = time - yearBefore100.valueOf() + dayTimeMS
    // 计算行数
    const rowNumber = Math.ceil((diff + diffYearBeforeFill) / (dayTimeMS * col))

    return rowNumber
  } else if (type === TimePickerType.MONTH) {
    const t = dayjs(time).startOf('month')
    const y = t.year()
    const m = t.month() + 1
    const diff = y - yearBefore100.year()
    const rowNumber = Math.ceil((diff * 12 + m) / col)

    return rowNumber
  } else if (type === TimePickerType.YEAR) {
    const t = dayjs(time).startOf('year')
    const y = t.year()
    const diff = y - yearBefore100.year() + 1
    const rowNumber = Math.ceil(diff / col)

    return rowNumber
  }

  const n: never = type
  return n
}
// 通过滚动高度获取行数
const getRowByScrollTop = (st: number): number => {
  if (st < 0) throw new Error('高度需要大于0')

  return Math.floor(st / contentItemNodeSize.fullHeight) + 1
}
// 通过行数获取滚动高度
const getScrollPosiByRow = (row: number) => {
  if (row < 1) throw new Error('行数需要大于0')
  return {
    start: (row - 1) * contentItemNodeSize.fullHeight,
    end: row * contentItemNodeSize.fullHeight
  }
}
// 通过行数获取这一行的日期数组
const getDatasByRow = (
  row: number,
  type: TimePickerType = currentType.value
): TimePickerRenderDataItems => {
  if (row < 1) throw new Error('行数需要大于0')

  const { col } = getGrid(type)

  if (type === TimePickerType.DAY) {
    // 当前行的开始时间
    const startTime = yearBefore100FirstTime + dayTimeMS * col * (row - 1)
    // 当前行所有时间
    const allTime: TimePickerRenderDataItem[] = new Array(col).fill(0).map((_, i) => {
      const t = startTime + dayTimeMS * i

      return {
        time: t,
        title: dayjs(t).date().toString()
      }
    })

    return {
      key: `day_${allTime[0].time}`,
      row,
      datas: allTime.map((item) =>
        // 超出范围的需要清理
        item.time < yearBefore100FirstTime || item.time >= yearAfter100LastTime ? null : item
      )
    }
  } else if (type === TimePickerType.MONTH) {
    const y = Math.floor(((row - 1) * col) / 12)
    const m = ((row - 1) * col) % 12
    const startTime = yearBefore100.add(y, 'year').add(m, 'month')
    const allTime: TimePickerRenderDataItem[] = new Array(col).fill(0).map((_, i) => {
      const t = startTime.add(i, 'month')

      return {
        time: t.valueOf(),
        title: `${t.month() + 1}月`
      }
    })

    return {
      key: `month_${allTime[0].time}`,
      row,
      datas: allTime.map((item) =>
        // 超出范围的需要清理
        item.time >= yearAfter100LastTime ? null : item
      )
    }
  } else if (type === TimePickerType.YEAR) {
    const y = (row - 1) * col
    const startTime = yearBefore100.add(y, 'year')
    const allTime: TimePickerRenderDataItem[] = new Array(col).fill(0).map((_, i) => {
      const t = startTime.add(i, 'year')

      return {
        time: t.valueOf(),
        title: t.year().toString()
      }
    })

    return {
      key: `year_${allTime[0].time}`,
      row,
      datas: allTime.map((item) =>
        // 超出范围的需要清理
        item.time >= yearAfter100LastTime ? null : item
      )
    }
  }

  const n: never = type
  return n
}
// 通过行数获取高亮时间范围
const getHighTimeScopeByRow = (
  row: number,
  type: TimePickerType = currentType.value
): [number, number] => {
  if (row < 1) throw new Error('行数需要大于0')

  const datas = getDatasByRow(row, type)
  const firstTime = datas.datas.find((item) => !!item)?.time

  if (!firstTime) return [0, 0]

  const t = dayjs(firstTime)

  // 视图为周时，高亮当前行第一个时间所在的整个月份
  if (type === TimePickerType.DAY) {
    const m = t.startOf('month')
    const start = m.valueOf()
    const end = m.add(1, 'month').valueOf()

    return [start, end]
  }
  // 视图为月时，高亮当前行第一个时间所在的整个年份
  else if (type === TimePickerType.MONTH) {
    const y = t.startOf('year')
    const start = y.valueOf()
    const end = y.add(1, 'year').valueOf()

    return [start, end]
  }
  // 视图为年时，高亮当前行第一个时间所在的10年区间
  else if (type === TimePickerType.YEAR) {
    const y = t.startOf('year')
    const sy = Math.floor(y.year() / 10) * 10
    const start = dayjs(`${sy}/1/1`).valueOf()
    const end = dayjs(`${sy + 10}/1/1`).valueOf()

    return [start, end]
  }

  const n: never = type
  return n
}

/**
 * 初始化
 * @param {Number} time 某一天的时间戳
 * @param {TimePickerType} type 进行初始化的类型
 * */
const init = (time: number = getToday(), type: TimePickerType = TimePickerType.DAY): void => {
  time = dayjs(time).startOf('day').valueOf()
  // 通过这一天来组合渲染的数据
  currentType.value = type
  currentTime.value = time
  selectTime.value = time

  // 时间对应行
  const rowNumber = getRowByTime(time)
  // 滚动到当前行高度
  scrollToRow(Math.max(rowNumber - 1, 1))
}

// 滚动到指定行
const scrollToRow = (row: number, isSmooth = false) => {
  const posi = getScrollPosiByRow(row)
  const top = Math.min(posi.start, contentNodeSize.value.height - scrollNodeHeight.value)
  nextTick(() => {
    // 不会发生滚动，手动触发
    if (scrollNode.value?.scrollTop === top) {
      scrollNode.value.scrollTop = top + 1
    }

    scrollNode.value?.scrollTo({ top, behavior: isSmooth ? 'smooth' : 'auto' })
  })
}
// 滚动
const handleContentScroll = (e: UIEvent) => {
  const target = e.target as HTMLDivElement
  const scrollTop = target.scrollTop
  // 填充
  const { rowNumber } = fillDatas(scrollTop)
  // 当前行
  currentRow.value = rowNumber
}

// 填充数据
const fillDatas = (st: number) => {
  const beforeRow = Math.ceil(contentRowNumber.value / 2) - 1
  const afterRow = Math.floor(contentRowNumber.value / 2)
  // 视图中的中间行
  const reviseTop = st + contentItemNodeSize.fullHeight * Math.floor(currentGrid.value.row / 2)
  // 当前行
  const rowNumber = getRowByScrollTop(reviseTop)
  const firstDataRow = dataList.value[0]?.row || 0
  const lastDataRow = dataList.value[dataList.value.length - 1]?.row || 0
  const isInit = firstDataRow === 0
  // 目标第一行
  const firstRow = Math.max(rowNumber - beforeRow, 1)
  // 需要填充个数
  const firstFillNum = isInit
    ? Math.min(contentRowNumber.value, maxRowNumber.value - firstRow + 1)
    : Math.min(firstDataRow - firstRow, contentRowNumber.value)
  // 向上滚动
  if (firstFillNum >= 0) {
    dataList.value.unshift(
      ...new Array(firstFillNum).fill(0).map((_, i) => getDatasByRow(firstRow + i))
    )
    dataList.value.splice(contentRowNumber.value)
  }
  // 向下滚动
  else {
    // 最后一行
    const lastRow = Math.min(rowNumber + afterRow, maxRowNumber.value)
    // 需要填充个数
    const lastFillNum = Math.min(lastRow - lastDataRow, contentRowNumber.value)

    dataList.value.push(
      ...new Array(lastFillNum).fill(0).map((_, i) => getDatasByRow(lastRow - lastFillNum + i + 1))
    )
    dataList.value.splice(0, Math.max(dataList.value.length - contentRowNumber.value, 0))
  }

  // console.log(
  //   rowNumber,
  //   firstDataRow,
  //   firstRow,
  //   firstFillNum,
  //   dataList.value.map((item) => item.row)
  // )

  return { reviseTop, rowNumber }
}

// 当前行
const currentRow = ref(1)
// 当前行日期
const currentRowDatas = computed(() => getDatasByRow(currentRow.value))
const currentRowDataFirst = computed(() => currentRowDatas.value.datas.find((item) => !!item))
// 高亮显示区间
const highTimeScope = computed(() => getHighTimeScopeByRow(currentRow.value))
// 判断高亮
const isHigh = (data: TimePickerRenderDataItem | null) => {
  if (!data) return false

  const [start, end] = highTimeScope.value

  return data.time >= start && data.time < end
}
// 日期
const titleTime = computed(() => {
  switch (currentType.value) {
    case TimePickerType.DAY:
      return `${dayjs(highTimeScope.value[0]).format('YYYY年MM月')}`
    case TimePickerType.MONTH:
      return `${dayjs(highTimeScope.value[0]).format('YYYY年')}`
    case TimePickerType.YEAR:
      return `${dayjs(highTimeScope.value[0]).year()} - ${dayjs(highTimeScope.value[1])
        .subtract(1, 'year')
        .year()}`

    default:
      return ''
  }
})
// 上一个月
const handleLastMonth = () => {
  if (!currentRowDataFirst.value) return
  // 获取上一个月的行
  const m = dayjs(currentRowDataFirst.value.time).startOf('month').subtract(1, 'month').valueOf()
  const row = getRowByTime(m)
  // 滚动到指定行
  scrollToRow(Math.max(row - 1, 1), true)
}
// 下一个月
const handleNextMonth = () => {
  if (!currentRowDataFirst.value) return
  // 获取下一个月的行
  const m = dayjs(currentRowDataFirst.value.time).startOf('month').add(1, 'month').valueOf()
  const row = getRowByTime(m)
  // 滚动到指定行
  scrollToRow(Math.max(row - 1, 1), true)
}

// 初始时间
const currentTime = ref(0)
const currentTimeMonth = computed(() => dayjs(currentTime.value).startOf('month').valueOf())
const currentTimeYear = computed(() => dayjs(currentTime.value).startOf('year').valueOf())
// 选择时间
const selectTime = ref(0)
// 修改选择时间
const updateSelectTime = (time: number) => (selectTime.value = time)
// 取消
const handleCancel = () => {
  emit('cancel')
}
// 确定
const handleSubmit = () => {
  emit('change', selectTime.value)
}
// 切换视图
const changeType = () => {
  const time = currentRowDataFirst.value!.time

  if (currentType.value === TimePickerType.DAY) {
    currentType.value = TimePickerType.MONTH
  } else if (currentType.value === TimePickerType.MONTH) {
    currentType.value = TimePickerType.YEAR
  } else return

  dataList.value = []
  // 时间对应行
  const rowNumber = getRowByTime(time)
  // 滚动到当前行高度
  scrollToRow(Math.max(rowNumber - 1, 1))
}
const enterType = (time: number) => {
  if (currentType.value === TimePickerType.YEAR) {
    currentType.value = TimePickerType.MONTH
  } else if (currentType.value === TimePickerType.MONTH) {
    currentType.value = TimePickerType.DAY
  } else return

  dataList.value = []
  // 时间对应行
  const rowNumber = getRowByTime(time)
  // 滚动到当前行高度
  scrollToRow(Math.max(rowNumber - 1, 1))
}

defineExpose<{
  init: (time?: number) => void
}>({
  init
})
</script>

<template>
  <div class="timepicker" :id="id">
    <div class="timepicker-top">
      <div class="time" @click="changeType">{{ titleTime }}</div>
      <Icon class="icon" iconfont="icon-up" @click="handleLastMonth" />
      <Icon class="icon" iconfont="icon-down" @click="handleNextMonth" />
    </div>
    <div class="timepicker-head" v-if="currentType === TimePickerType.DAY">
      <div class="head-item" v-for="head in weekHeads">
        {{ head }}
      </div>
    </div>
    <div
      class="timepicker-content"
      ref="scrollNode"
      :style="{ height: `${scrollNodeHeight}px` }"
      @scroll="handleContentScroll"
    >
      <div
        class="content-box"
        :style="{
          height: `${contentNodeSize.height}px`,
          width: `${contentNodeSize.width}px`
        }"
      >
        <ItemDay ref="contentItemDayNode" :data="null" class="hide" />
        <ItemMonthYear ref="contentItemMonthYearNode" :data="null" class="hide" />

        <template v-if="currentType === TimePickerType.DAY">
          <div
            class="content-item-row"
            v-for="items in dataList"
            :key="items.key"
            :style="{ top: `${getScrollPosiByRow(items.row).start}px` }"
          >
            <ItemDay
              v-for="item in items.datas"
              :data="item"
              :highlight="isHigh(item)"
              :select="currentTime === item?.time"
              :active="selectTime === item?.time"
              @click="(e) => updateSelectTime(e.time)"
            />
          </div>
        </template>

        <template
          v-else-if="currentType === TimePickerType.MONTH || currentType === TimePickerType.YEAR"
        >
          <div
            class="content-item-row"
            v-for="items in dataList"
            :key="items.key"
            :style="{ top: `${getScrollPosiByRow(items.row).start}px` }"
          >
            <ItemMonthYear
              v-for="item in items.datas"
              :data="item"
              :highlight="isHigh(item)"
              :select="
                (currentType === TimePickerType.MONTH ? currentTimeMonth : currentTimeYear) ===
                item?.time
              "
              @click="(e) => enterType(e.time)"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="timepicker-bottom">
      <div class="bottom-cancel" @click="handleCancel">取消</div>
      <div class="bottom-submit" @click="handleSubmit">保存</div>
    </div>
  </div>
</template>

<style scoped>
.timepicker {
  padding: 8px;
}

.timepicker-top {
  display: flex;
  margin-bottom: 3px;
}

.timepicker-top .time {
  flex-grow: 1;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 4px;
  padding-left: 14px;
  font-size: 20px;
  line-height: 38px;
  user-select: none;
}

.timepicker-top .time:hover {
  border-color: rgb(240, 240, 240);
}

.timepicker-top .icon {
  width: 36px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 4px;
}

.timepicker-top .icon:hover {
  border-color: rgb(240, 240, 240);
}

.timepicker-head {
  display: flex;
}

.timepicker-head .head-item {
  width: 36px;
  height: 36px;
  text-align: center;
  line-height: 36px;
  user-select: none;
}

.timepicker-content {
  overflow: auto;
}

.content-box {
  position: relative;
  z-index: 0;
}

.content-item-row {
  display: flex;
  position: absolute;
  left: 0;
}

.timepicker-content .hide {
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.timepicker-bottom {
  margin-top: 12px;
  margin-bottom: 6px;
  display: flex;
}

.bottom-cancel,
.bottom-submit {
  flex-grow: 1;
  border-radius: 4px;
  height: 32px;
  line-height: 30px;
  border: 1px solid transparent;
  text-align: center;
  cursor: pointer;
}

.bottom-cancel {
  border-color: rgb(240, 240, 240);
  margin-right: 5px;
}

.bottom-cancel:hover {
  background-color: rgb(252, 252, 252);
}

.bottom-submit {
  border-color: transparent;
  background-color: var(--color-primary);
  color: #fff;
}

.bottom-submit:hover {
  background-color: var(--color-primary-high);
}
</style>
