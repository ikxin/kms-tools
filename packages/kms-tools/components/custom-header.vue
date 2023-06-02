<script setup lang="ts">
import { navigate } from 'vite-plugin-ssr/client/router'

const menuItems = [
  {
    key: 'index',
    label: '首页',
    icon: 'i-mdi:home',
  },
  {
    key: 'activation',
    label: '软件激活',
    icon: 'i-mdi:microsoft-windows',
  },
  {
    key: 'software',
    label: '软件下载',
    icon: 'i-mdi:folder-download',
  },
  {
    key: 'monitor',
    label: '服务监控',
    icon: 'i-mdi:server',
  },
  {
    key: 'guide',
    label: '帮助中心',
    icon: 'i-mdi:document',
  },
]

async function redirectPage(url: string) {
  await navigate(url === 'index' ? '/' : '/' + url)
}
</script>

<template>
  <ALayoutHeader class="select-none bg-white p-0">
    <div class="mx-auto flex w-256 max-w-full items-center justify-between">
      <img h-12 src="/images/logo.svg" alt="KMS Tools" />
      <AMenu mode="horizontal" class="grow">
        <AMenuItem
          v-for="item in menuItems"
          :key="item.key"
          class="!inline-flex items-center gap-1"
          @click="redirectPage(item.key)"
        >
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </AMenuItem>
      </AMenu>
    </div>
  </ALayoutHeader>
</template>
