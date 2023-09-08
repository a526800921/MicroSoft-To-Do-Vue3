import type { Ref } from 'vue'
import { watch, reactive, onBeforeUnmount, toRefs } from 'vue'
import { createResizeObserverId } from '@/config/idConfig'

interface ObserveItems {
  [id: string]: (borderBoxSize: ResizeObserverSize, contentBoxSize: ResizeObserverSize) => void
}

const elMap = new WeakMap<HTMLElement, ObserveItems>()
const resizeObserver = new ResizeObserver((e) => {
  // console.log(e)
  e.forEach((item) => {
    const { borderBoxSize, contentBoxSize, target } = item
    const items = elMap.get(target as HTMLElement)

    if (items) Object.keys(items).forEach((key) => items[key](borderBoxSize[0], contentBoxSize[0]))
  })
})

export const useResizeObserver = <T extends Ref<HTMLElement | null>>(el: T) => {
  const id = createResizeObserverId()
  const size = reactive({
    width: 0,
    height: 0,
    fullWidth: 0, // 包含边框的宽度
    fullHeight: 0 // 包含边框的高度
  })

  const clear = (elem: HTMLElement) => {
    resizeObserver.unobserve(elem)
    const hash = elMap.get(elem)
    if (hash) delete hash[id]
  }

  watch(
    el,
    (newEL, oldEl) => {
      if (oldEl) clear(oldEl)

      if (newEL) {
        let hash = elMap.get(newEL)
        if (!hash) elMap.set(newEL, (hash = {}))

        hash[id] = (borderBoxSize, contentBoxSize) => {
          size.width = contentBoxSize.inlineSize
          size.height = contentBoxSize.blockSize
          size.fullWidth = borderBoxSize.inlineSize
          size.fullHeight = borderBoxSize.blockSize
        }

        // 节点存在时立马获取
        const cs = getComputedStyle(newEL)
        size.width = parseInt(cs.getPropertyValue('width'))
        size.height = parseInt(cs.getPropertyValue('height'))
        size.fullWidth = newEL.offsetWidth
        size.fullHeight = newEL.offsetHeight

        resizeObserver.observe(newEL)
      }
    },
    {
      flush: 'sync'
    }
  )

  // 清除
  onBeforeUnmount(() => {
    if (el.value) clear(el.value)
  })

  return size
}
