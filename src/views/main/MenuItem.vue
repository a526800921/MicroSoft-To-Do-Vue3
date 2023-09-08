<script setup lang="ts">
import type { MenuItem } from '@/interface/data'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getIconUrl } from '@/config/iconConfig'

import Icon from '@/components/Icon/index.vue'

const props = defineProps<{
  data: MenuItem & { taskNum: number }
  iconType: 1 | 2 // 图标类型，1 -> 图片， 2 -> iconfont
  getPath: () => string
}>()

const route = useRoute()
const router = useRouter()

const isActive = computed(() => props.getPath() === route.path)

const changePage = () => {
  if (route.path === props.getPath()) return

  router.replace(props.getPath())
}
</script>

<template>
  <div class="item" :class="{ active: isActive }" @click="changePage">
    <Icon v-if="iconType === 1" class="iconi" :picture="getIconUrl(data.icon)" />
    <Icon v-else-if="iconType === 2" class="iconf" :iconfont="data.icon" />
    <p>{{ data.title }}</p>
    <span v-if="data.taskNum">{{ data.taskNum }}</span>
  </div>
</template>

<style scoped>
.item {
  margin: 0 5px 5px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: relative;
  z-index: 0;
  transition: background-color 0.2s;
  user-select: none;
}

.active,
.item:hover {
  background-color: rgb(230, 230, 230);
}

.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 4px;
  background-color: var(--color-primary);
}

.item .iconi {
  height: 18px;
  width: 18px;
}

.item .iconf {
  width: 18px;
  font-size: 18px;
}

.item p {
  margin-left: 10px;
  flex: 1;
}

.item span {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background-color: rgb(220, 220, 220);
  text-align: center;
  line-height: 16px;
  font-size: 10px;
}
</style>
