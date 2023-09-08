import type { ThemeItem } from '@/interface/data'
import { createThemeId } from './idConfig'
import { getImageUrlJpg } from '@/utils/utils'

const linearGradient = (from: string, to: string) => `linear-gradient(rgb(${from}), rgb(${to}))`

export const themes: ThemeItem[] = [
  {
    id: 'theme_1679806904669_606715308696',
    type: 'color',
    src: linearGradient('92,112,190', '120,140,222')
  },
  {
    id: 'theme_1679806904669_485219588715',
    type: 'color',
    src: linearGradient('157,93,159', '188,122,188')
  },
  {
    id: 'theme_1679806904669_557980109794',
    type: 'color',
    src: linearGradient('193,76,108', '228,108,140')
  },
  {
    id: 'theme_1679806904669_669532102311',
    type: 'color',
    src: linearGradient('194,79,74', '228,107,103')
  },
  {
    id: 'theme_1679806904669_662903493280',
    type: 'color',
    src: linearGradient('42,131,93', '74,160,121')
  },
  {
    id: 'theme_1679806904669_489970981952',
    type: 'color',
    src: linearGradient('37,129,124', '71,158,152')
  },
  {
    id: 'theme_1679806904669_718140171380',
    type: 'color',
    src: linearGradient('104,118,129', '135,149,160')
  },
  {
    id: 'theme_1679806904669_747090633011',
    type: 'pic',
    src: getImageUrlJpg('bg0')
  },
  {
    id: 'theme_1679806904669_781516164788',
    type: 'pic',
    src: getImageUrlJpg('bg1')
  },
  {
    id: 'theme_1679806904669_236101185497',
    type: 'pic',
    src: getImageUrlJpg('bg2')
  },
  {
    id: 'theme_1679806904669_714108617365',
    type: 'pic',
    src: getImageUrlJpg('bg3')
  },
  {
    id: 'theme_1679806904669_786893041716',
    type: 'pic',
    src: getImageUrlJpg('bg4')
  },
  {
    id: 'theme_1679806904669_460546617556',
    type: 'pic',
    src: getImageUrlJpg('bg5')
  },
  {
    id: 'theme_1679806904669_272238489776',
    type: 'pic',
    src: getImageUrlJpg('bg6')
  },
  {
    id: 'theme_1679806904669_516358578765',
    type: 'pic',
    src: getImageUrlJpg('bg7')
  },
  {
    id: 'theme_1679806904669_419796188810',
    type: 'pic',
    src: getImageUrlJpg('bg8')
  }
]

export const getTheme = (id: string) => themes.find((item) => item.id === id)
