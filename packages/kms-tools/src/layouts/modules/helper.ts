import {
  Home,
  ApplicationOne,
  DownloadWeb,
  DataServer,
  DocSearchTwo,
  Brightness,
  DarkMode,
  SettingTwo,
} from '@icon-park/vue-next'
import { BasicColorSchema } from '@vueuse/core'
import { Component } from 'vue'

interface MenuItem {
  name: string
  title: string
  icon: Component
}

interface ColorModeItem {
  lable: string
  value: BasicColorSchema
  icon: Component
}

/** 菜单选项 */
export const menuOption: Array<MenuItem> = [
  {
    name: 'home',
    title: '首页',
    icon: Home,
  },
  {
    name: 'activation',
    title: '软件激活',
    icon: ApplicationOne,
  },
  {
    name: 'download',
    title: '软件下载',
    icon: DownloadWeb,
  },
  {
    name: 'service',
    title: '服务监控',
    icon: DataServer,
  },
  {
    name: 'help',
    title: '帮助中心',
    icon: DocSearchTwo,
  },
]

/** 颜色模式选项 */
export const colorModeOption: Array<ColorModeItem> = [
  {
    lable: '浅色模式',
    value: 'light',
    icon: Brightness,
  },
  {
    lable: '深色模式',
    value: 'dark',
    icon: DarkMode,
  },
  {
    lable: '跟随系统',
    value: 'auto',
    icon: SettingTwo,
  },
]
