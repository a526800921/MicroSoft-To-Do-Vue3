<script setup lang="ts">
defineProps<{
  iconfont?: string
  picture?: string
  rotate?: number
}>()
</script>

<template>
  <i
    class="icon"
    :class="[
      iconfont ? `iconfont ${iconfont}` : '',
      picture ? 'img' : '',
      rotate === void 0 ? '' : 'rotate'
    ]"
    :style="[picture ? `background-image: url(${picture});` : '']"
  />
</template>

<style scoped>
.img {
  display: block;
  background-size: contain;
  background-repeat: no-repeat;
}

.icon.rotate::before {
  transform: rotate(calc(v-bind(rotate) * 1deg));
}
</style>
