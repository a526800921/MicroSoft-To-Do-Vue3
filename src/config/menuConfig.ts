import type { ID, MenuItem } from '@/interface/data'
import { MenuType } from '@/interface/data'

export const staticMenus: MenuItem[] = [
  {
    id: 'menu_1679231831155_1834480663448',
    icon: 'icon-daytime-mode',
    title: '我的一天',
    path: '/oneday',
    type: MenuType.ONEDAY
  },
  {
    id: 'menu_1679231831155_6736275703325',
    icon: 'icon-favorites',
    title: '重要',
    path: '/important',
    type: MenuType.IMPORTANT
  },
  {
    id: 'menu_1679231831155_9026962991701',
    icon: 'icon-application-record',
    title: '计划内',
    path: '/plan',
    type: MenuType.PLAN
  },
  {
    id: 'menu_1679231831155_4725451709771',
    icon: 'icon-home',
    title: '任务',
    path: '/all',
    type: MenuType.ALL
  },
]

export const staticSearchMenu: MenuItem = {
  id: 'menu_1679231831155_4725451709772',
  icon: '',
  title: '搜索',
  path: '/search',
  type: MenuType.SEARCH
}

export const getStaticMenu = (id: ID) => staticMenus.find((item) => item.id === id)
export const getStaticMenuByType = (type: MenuType) =>
  staticMenus.find((item) => item.type === type)!