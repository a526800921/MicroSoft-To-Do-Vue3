<script setup lang="ts">
import Icon from '@/components/Icon/index.vue'

withDefaults(
  defineProps<{
    icon: string
    title: string
    useArrow?: boolean
    type?: 'default' | 'warn'
  }>(),
  {
    useArrow: false,
    type: 'default'
  }
)
</script>

<template>
  <div
    class="moreitem"
    :class="{
      warn: type === 'warn'
    }"
  >
    <div class="item-left">
      <Icon class="icon" :iconfont="icon" />
    </div>
    <div class="item-center">
      {{ title }}
    </div>
    <div class="item-right">
      <Icon v-if="useArrow" class="icon" iconfont="icon-right" />
    </div>
  </div>
</template>

<style scoped>
.moreitem {
  display: flex;
  align-items: center;
  height: 46px;
  user-select: none;
}

.moreitem:hover {
  background-color: #efefef;
}

.warn {
  color: var(--color-warn);
}

.item-left,
.item-right {
  width: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-center {
  flex: 1;
}
</style>
