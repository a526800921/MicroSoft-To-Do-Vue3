import type { ID, IconItem } from '@/interface/data'
import { getImageUrlPng } from '@/utils/utils'

export const Icons: IconItem[] = [
  {
    id: 'icon_1679232576496_7568295290741',
    url: getImageUrlPng('icon0')
  },
  {
    id: 'icon_1679232576496_5998662383793',
    url: getImageUrlPng('icon1')
  },
  {
    id: 'icon_1679232576496_2885047280944',
    url: getImageUrlPng('icon2')
  },
  {
    id: 'icon_1679232576496_5784840902129',
    url: getImageUrlPng('icon3')
  },
  {
    id: 'icon_1679232576496_1088165967229',
    url: getImageUrlPng('icon4')
  },
  {
    id: 'icon_1679232576496_0243573831119',
    url: getImageUrlPng('icon5')
  },
  {
    id: 'icon_1679232576496_0386333558794',
    url: getImageUrlPng('icon6')
  },
  {
    id: 'icon_1679232576496_4668049180748',
    url: getImageUrlPng('icon7')
  },
  {
    id: 'icon_1679232576496_2730233946486',
    url: getImageUrlPng('icon8')
  },
  {
    id: 'icon_1679232576496_4094446127803',
    url: getImageUrlPng('icon9')
  },
  {
    id: 'icon_1679232576496_8647112773762',
    url: getImageUrlPng('onday')
  },
  {
    id: 'icon_1679232576496_8380098804107',
    url: getImageUrlPng('important')
  },
  {
    id: 'icon_1679232576496_8208908857768',
    url: getImageUrlPng('plan')
  },
  {
    id: 'icon_1679232576496_9351030493869',
    url: getImageUrlPng('all')
  }
]

export const getDefaultIconId = () => Icons[0].id

export const getIconUrl = (id: ID) => Icons.find((item) => item.id === id)!.url
