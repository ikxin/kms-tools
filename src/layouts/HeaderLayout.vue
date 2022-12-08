<script setup lang="ts">
import logoHead from '@/assets/icons/logo-head.svg'
import { Home, ApplicationOne, DownloadWeb, DataServer, DocSearchTwo, SunOne, Translate } from '@icon-park/vue-next'

const menuData = [
  { id: 1, title: '首页', icon: Home },
  { id: 2, title: '软件激活', icon: ApplicationOne },
  { id: 3, title: '软件下载', icon: DownloadWeb },
  { id: 4, title: '服务监控', icon: DataServer },
  { id: 5, title: '帮助中心', icon: DocSearchTwo },
]
</script>

<template>
  <a-layout-header class="bg-white p-0">
    <div class="mx-auto flex w-container max-w-full items-center justify-between">
      <img class="h-14" :src="logoHead" alt="KMS Tools" />
      <a-menu class="grow justify-end" mode="horizontal" theme="light">
        <a-menu-item v-for="menu in menuData" :key="menu.id">
          {{ menu.title }}
          <template #icon>
            <component :is="menu.icon"></component>
          </template>
        </a-menu-item>
      </a-menu>
      <a-space>
        <a-button size="small" type="text"><SunOne /></a-button>
        <a-button size="small" type="text"><Translate /></a-button>
      </a-space>
    </div>
  </a-layout-header>
</template>
