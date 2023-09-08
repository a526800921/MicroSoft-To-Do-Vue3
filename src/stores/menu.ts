import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ID, MenuItem } from '@/interface/data'
import { MenuType } from '@/interface/data'
import { createMenuId } from '@/config/idConfig'
import { getDefaultIconId } from '@/config/iconConfig'

export interface UpdateCustomMenuParam {
  id: ID
  icon?: ID
  title?: string
}

export const createMenuItem = (title: string): MenuItem => ({
  id: createMenuId(),
  icon: getDefaultIconId(),
  title,
  path: '/custom',
  type: MenuType.CUSTOM,
})

export const useMenuStore = defineStore(
  'menu',
  () => {
    const customMenu = ref<MenuItem[]>([])

    // 创建菜单
    const createCustomMenu = () => {
      customMenu.value.push(createMenuItem('无标题列表'))
      return true
    }

    // 更新菜单
    const updateCustomMenu = (param: UpdateCustomMenuParam) => {
      const find = customMenu.value.find((item) => item.id === param.id)

      if (!find) return false

      if (param.title) find.title = param.title
      if (param.icon) find.icon = param.icon

      return true
    }

    // 删除菜单
    const deleteCustomMenu = (id: ID) => {
      const findIndex = customMenu.value.findIndex((item) => item.id === id)

      if (findIndex === -1) return false

      customMenu.value.splice(findIndex, 1)

      return true
    }

    // 获取菜单
    const getCustomMenu = (id: ID) => customMenu.value.find(item => item.id === id)
    // 获取菜单路径
    const getCustomMenuPath = (item: MenuItem) => `${item.path}/${item.id}`

    return {
      customMenu,
      createCustomMenu,
      updateCustomMenu,
      deleteCustomMenu,
      getCustomMenu,
      getCustomMenuPath,
    }
  },
  {
    persist: {
      paths: ['customMenu']
    }
  }
)
