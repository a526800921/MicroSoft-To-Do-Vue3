<script lang="ts">
import type { RectItem } from '@/interface/public'

// 栈结构，后展示的先隐藏
const rects: {
  id: string
  rect: RectItem
  hide: Function
}[] = []

const clear = (id: string) => {
  const index = rects.findIndex((item) => item.id === id)
  if (index > -1) rects.splice(index, 1)
}

const hideMore = (e: MouseEvent) => {
  const { pageX, pageY } = e
  const startLength = rects.length

  if (startLength === 0) return

  for (let i = startLength - 1; i >= 0; i--) {
    const { rect, hide } = rects[i]

    if (isPointInRect(pageX, pageY, rect)) {
      break
    } else {
      hide()
    }
  }

  // 点击外部时，都没有命中，全都被关闭，需要阻止捕获
  rects.length === 0 && e.stopImmediatePropagation()
}
</script>

<script setup lang="ts">
import { ref, watch, toRefs, reactive, onBeforeUnmount, onMounted, computed } from 'vue'
import { useResizeObserver } from '@/use/ResizeObserver'
import { computedElementPositionBoundary, isPointInRect } from '@/utils/utils'
import { createMoreDialogId } from '@/config/idConfig'

const id = createMoreDialogId()

const props = withDefaults(
  defineProps<{
    target: HTMLElement | null
    orientation?: 'top' | 'right' | 'bottom' | 'left' // 出现方向
    offsetX?: number // 间隔距离 x
    offsetY?: number // 间隔距离 y
    visible: boolean
  }>(),
  {
    orientation: 'bottom',
    offsetX: 0,
    offsetY: 0
  }
)

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
}>()

const { visible } = toRefs(props)

const children = ref<HTMLDivElement | null>(null)
const { fullHeight, fullWidth } = toRefs(useResizeObserver(children))
const position = reactive({
  top: 0,
  left: 0
})

// 弹窗展示时需要调整展示的位置
const moreShowedUpdatePosition = () => {
  const { x = 0, y = 0, width = 0, height = 0 } = props.target?.getBoundingClientRect() || {}
  const compute = (x: number, y: number) =>
    computedElementPositionBoundary(x, y, fullWidth.value, fullHeight.value, { distance: 10 })

  // 出现的位置
  let posi = { x: 0, y: 0 }

  // 判断出现方位
  if (props.orientation === 'top') {
    posi = compute(
      x + width - fullWidth.value + props.offsetX,
      y - fullHeight.value + props.offsetY
    )
  } else if (props.orientation === 'right') {
    posi = compute(x + width + props.offsetX, y + props.offsetY)
  } else if (props.orientation === 'bottom') {
    posi = compute(x + props.offsetX, y + height + props.offsetY)
  } else if (props.orientation === 'left') {
    posi = compute(x - fullWidth.value + props.offsetX, y + props.offsetY)
  }

  position.top = posi.y
  position.left = posi.x
}

// 弹窗展示时需要在展示栈中保存/修改自己的位置
const moreShowedUpdateStackRect = () => {
  const index = rects.findIndex((item) => item.id === id)

  // 如果没有则添加
  if (index === -1) {
    rects.push({
      id,
      rect: {
        startX: position.left,
        startY: position.top,
        endX: position.left + fullWidth.value,
        endY: position.top + fullHeight.value
      },
      hide: () => {
        clear(id)
        emit('update:visible', false)
      }
    })
  }
  // 如果有则修改
  else {
    rects[index].rect = {
      startX: position.left,
      startY: position.top,
      endX: position.left + fullWidth.value,
      endY: position.top + fullHeight.value
    }
  }
}

// 监听弹窗展示
watch(visible, (v) => {
  if (v) {
    // 调整展示位置
    moreShowedUpdatePosition()
    // 添加到弹窗展示栈
    moreShowedUpdateStackRect()
  } else {
    // 隐藏的时候清除展示栈中的信息
    clear(id)
  }
})
// 监听弹窗内容修改
const sizeChange = computed(() => `${fullHeight.value}/${fullWidth.value}`)
watch(sizeChange, (v) => {
  // 弹窗展示时才进行修改
  if (visible.value) {
    moreShowedUpdateStackRect()
  }
})


onMounted(() => {
  document.body.addEventListener('click', hideMore, true)
})

onBeforeUnmount(() => {
  clear(id)
  // 没有弹窗了才移除
  rects.length === 0 && document.body.removeEventListener('click', hideMore)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="more"
      :class="{ 'more-active': visible }"
      :style="{
        '--height': `${fullHeight}px`,
        top: `${position.top}px`,
        left: `${position.left}px`
      }"
      v-bind="$attrs"
    >
      <div class="more-items" ref="children">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.more {
  width: 290px;
  height: 0;
  overflow: hidden;
  background-color: #fff;
  border-radius: 4px;
  position: fixed;
  z-index: 9999;
  transition-duration: 0.2s;
  transition-property: height, box-shadow;
}

.more-active {
  height: var(--height);
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.2);
}

.more-items {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
