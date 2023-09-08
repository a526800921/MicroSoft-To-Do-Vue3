import { computed, ref, reactive, toRaw } from 'vue'
import { defineStore } from 'pinia'
import type { BackgroundSettingItem, ThemeItem } from '@/interface/data'
import { staticMenus } from '@/config/menuConfig'
import { themes, getTheme } from '@/config/themeConfig'

export const useSettingStore = defineStore(
  'setting',
  () => {
    // 背景图
    const backgroundSettings = ref<BackgroundSettingItem[]>([
      ...staticMenus.map((item, index) => ({
        id: item.id,
        themeId: themes[index].id
      }))
    ])

    // 根据菜单id获取背景图
    const getBackgroundSetting = (id: string): ThemeItem => {
      const themeId = backgroundSettings.value.find((item) => item.id === id)?.themeId

      return (themeId ? getTheme(themeId) : void 0) || themes[0]
    }

    // 设置背景图
    const setBackgroundSetting = (id: string, themeId: string): void => {
      const findIndex = backgroundSettings.value.findIndex((item) => item.id === id)

      if (findIndex > -1) backgroundSettings.value.splice(findIndex, 1, { id, themeId })
      else backgroundSettings.value.push({ id, themeId })
    }

    return {
      backgroundSettings,
      getBackgroundSetting,
      setBackgroundSetting
    }
  },
  {
    persist: {
      paths: ['backgroundSettings']
    }
  }
)
