<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLoginInfoStore } from '@/stores/user'
import { staticMenus } from '@/config/menuConfig'
import { useMenuStore } from '@/stores/menu'
import { useTaskStore } from '@/stores/task'
import type { MenuItem } from '@/interface/data'
import { useAppStore } from '@/stores/app'

import MenuItemNode from './MenuItem.vue'
import Icon from '@/components/Icon/index.vue'
import Line from '@/components/Line/index.vue'

const route = useRoute()
const router = useRouter()
const { userInfo, avatar } = storeToRefs(useLoginInfoStore())
const appStore = useAppStore()

// 搜索
const searchValue = computed({
  get() {
    return appStore.searchValue
  },
  set(val) {
    appStore.changeSearchValue(val)
  }
})
const hasValue = computed(() => searchValue.value.length > 0)
const clearSearchValue = () => {
  searchValue.value = ''
}
const toSearch = () => {
  if (route.path !== '/search') router.push('/search')
}
const backSearch = () => {
  if (route.path === '/search') router.back()
}
watch(searchValue, (newV) => {
  // 有值的时候跳转到搜索页面
  if (newV.length > 0) toSearch()
  // 没值的时候从搜索页面返回
  else backSearch()
})

// 数据
const taskStore = useTaskStore()
const menuStore = useMenuStore()

// 菜单
const getUnfinishedTaskLength = (menu: MenuItem) =>
  taskStore.getMenuTasks(menu).filter((m) => !m.finished).length
const staticMenuList = computed(() =>
  staticMenus.map((item) => ({
    ...item,
    taskNum: getUnfinishedTaskLength(item)
  }))
)
const customMenuList = computed(() =>
  menuStore.customMenu.map((item) => ({
    ...item,
    taskNum: getUnfinishedTaskLength(item)
  }))
)

// 添加菜单
const addMenu = () => {
  menuStore.createCustomMenu()
}
</script>

<template>
  <div class="menu">
    <div class="avatar">
      <img :src="avatar" alt="avatar" />
      <p>{{ userInfo.name }}</p>
    </div>

    <div class="search">
      <input type="text" v-model="searchValue" placeholder="Search" />
      <div v-show="hasValue" class="search-btn" @click="clearSearchValue">
        <Icon class="search-icon" iconfont="icon-error" />
      </div>
      <div class="search-btn" @click="toSearch">
        <Icon class="search-icon" iconfont="icon-search" />
      </div>
    </div>

    <div class="menus">
      <MenuItemNode
        v-for="menu in staticMenuList"
        :data="menu"
        :get-path="() => menu.path"
        :icon-type="2"
      />
      <Line v-if="menuStore.customMenu.length > 0" />
      <MenuItemNode
        v-for="(menu, index) in customMenuList"
        :data="menu"
        :get-path="() => menuStore.getCustomMenuPath(menuStore.customMenu[index])"
        :icon-type="1"
      />
    </div>

    <div class="add" @click="addMenu">
      <Icon class="add-icon" iconfont="icon-add" />
      <p>新建列表</p>
    </div>
  </div>
</template>

<style scoped>
.menu {
  width: 280px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.avatar {
  display: flex;
  align-items: center;
  height: 80px;
}

.avatar img {
  width: 50px;
  height: 50px;
  margin: 0 20px;
  border-radius: 50%;
}

.avatar p {
  font-weight: 500;
  font-size: 20px;
}

.search {
  width: 250px;
  height: 30px;
  background-color: rgb(250, 250, 250);
  border-radius: 4px;
  border: 1px solid var(--color-border);
  margin: 0 auto 10px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.search:focus-within {
  background-color: var(--color-white);
}

.search input {
  border: 0;
  outline: none;
  background-color: transparent;
  display: block;
  flex: 1;
  height: 20px;
}

.search-btn {
  width: 30px;
  height: 20px;
  border-radius: 4px;
  transition: background-color 0.2s;
  cursor: pointer;
  margin-left: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background-color: rgba(227, 227, 227, 0.8);
}

.search-icon {
  font-size: 18px;
  color: #777;
}

.menus {
  flex-grow: 1;
  overflow: auto;
}

.add {
  height: 40px;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  user-select: none;
}

.add:hover {
  background-color: rgba(220, 220, 220, 0.4);
}

.add .add-icon {
  width: 50px;
  display: flex;
  justify-content: center;
  font-size: 20px;
}
</style>
