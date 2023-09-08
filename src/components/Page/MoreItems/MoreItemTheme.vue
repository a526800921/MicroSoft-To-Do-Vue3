<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeItem, MenuItem } from '@/interface/data'
import { themes } from '@/config/themeConfig'
import { useSettingStore } from '@/stores/setting'

const props = defineProps<{
  menu: MenuItem
}>()

const settingStore = useSettingStore()

const current = computed(() => settingStore.getBackgroundSetting(props.menu.id))

const changeBg = (theme: ThemeItem) => {
  settingStore.setBackgroundSetting(props.menu.id, theme.id)
}
</script>

<template>
  <div class="moretheme">
    <div class="title">主题</div>
    <div class="themelist">
      <div class="themeitem" v-for="item in themes">
        <div class="box" :class="{ active: current.id === item.id }" @click="changeBg(item)">
          <div
            class="bg"
            :style="{
              'background-image': item.type === 'pic' ? `url(${item.src})` : item.src
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.moretheme {
  padding: 15px 10px;
}

.title {
  font-size: 16px;
  line-height: 1;
  padding-left: 5px;
  margin-bottom: 10px;
}

.themelist {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.themeitem {
  width: 20%;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.themeitem .box {
  width: 50px;
  height: 50px;
  box-sizing: border-box;
  border: 2px solid transparent;
  padding: 2px;
}

.themeitem .box:hover {
  border-color: rgba(0, 0, 0, 0.1);
}

.themeitem .box.active {
  border-color: rgba(26, 107, 168, 1);
}

.themeitem .bg {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
