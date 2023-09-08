export interface TimePickerGridOptions {
  row: number
  col: number
}

export const weekGrid: TimePickerGridOptions = {
  row: 6,
  col: 7
}

export const monthGrid: TimePickerGridOptions = {
  row: 4,
  col: 4
}

export const yearGrid: TimePickerGridOptions = {
  row: 4,
  col: 4
}

export enum TimePickerType {
    YEAR = 1,
    MONTH,
    DAY
}

export const typeToGrid = {
    [TimePickerType.YEAR]: yearGrid,
    [TimePickerType.MONTH]: monthGrid,
    [TimePickerType.DAY]: weekGrid
}

export interface TimePickerRenderDataItem {
    time: number // 时间戳
    title: string
}

export interface TimePickerRenderDataItems {
    key: string
    row: number // 当前行数
    datas: (TimePickerRenderDataItem | null)[]
}
