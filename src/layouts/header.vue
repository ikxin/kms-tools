<script setup lang="ts">
import logoHead from '@/assets/icons/logo-head.svg'
import {
  Home,
  ApplicationOne,
  DownloadWeb,
  DataServer,
  DocSearchTwo,
  SunOne,
  Translate,
  GithubOne,
} from '@icon-park/vue-next'
import { type Component } from 'vue'

interface Menu {
  id: number
  title: string
  icon: Component
}

const menuData: Array<Menu> = [
  { id: 1, title: '首页', icon: Home },
  { id: 2, title: '软件激活', icon: ApplicationOne },
  { id: 3, title: '软件下载', icon: DownloadWeb },
  { id: 4, title: '服务监控', icon: DataServer },
  { id: 5, title: '帮助中心', icon: DocSearchTwo },
]
</script>

<template>
  <a-layout-header class="select-none bg-white p-0">
    <div class="mx-auto flex w-container max-w-full items-center justify-between">
      <img class="h-12" :src="logoHead" alt="KMS Tools" />
      <a-menu class="grow whitespace-nowrap xs:max-md:w-36" mode="horizontal" theme="light">
        <template v-for="menu in menuData" :key="menu.id">
          <a-menu-item>
            {{ menu.title }}
            <template #icon><component :is="menu.icon"></component></template>
          </a-menu-item>
        </template>
      </a-menu>
      <a-space class="mr-4">
        <a-button size="small" type="secondary">
          <template #icon>
            <component :is="SunOne"></component>
          </template>
        </a-button>
        <a-button size="small" type="secondary">
          <template #icon>
            <Translate />
          </template>
        </a-button>
        <a-button size="small" type="secondary">
          <template #icon>
            <GithubOne />
          </template>
        </a-button>
      </a-space>
    </div>
  </a-layout-header>
</template>

<style scoped>
:deep(.arco-menu-overflow-wrap) {
  display: flex;
  justify-content: flex-end;
}

:deep(.arco-menu-icon) {
  margin-right: 8px !important;
}
</style>
