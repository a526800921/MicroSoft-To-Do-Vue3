<script setup lang="ts">
import Icon from '@/components/Icon/index.vue'

withDefaults(
  defineProps<{
    icon?: string
    title: string
    type?: 'primary' | 'warn'
    showClear?: boolean
  }>(),
  {
    showClear: false
  }
)

defineEmits<{
  (e: 'click'): void
  (e: 'clear'): void
}>()
</script>

<template>
  <div class="detailitem">
    <div class="left hover" :class="type" @click="$emit('click')">
      <Icon class="icon" v-if="icon" :iconfont="icon" />
      <p>{{ title }}</p>
    </div>
    <div class="right hover" v-if="showClear" @click="$emit('clear')">
      <Icon class="icon" iconfont="icon-close" />
    </div>
  </div>
</template>

<style scoped>
.detailitem {
  display: flex;
  height: 48px;
}

.hover:hover {
  background-color: rgb(247, 247, 247);
}

.left {
  flex-grow: 1;
  border-radius: 4px;
  user-select: none;
  display: flex;
  align-items: center;
  padding-left: 12px;
}

.left .icon {
  font-size: 18px;
  margin-right: 10px;
}

.left.primary {
  color: var(--color-primary);
}

.left.warn {
  color: var(--color-warn);
}

.right {
  width: 45px;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right .icon {
  font-size: 18px;
}
</style>
