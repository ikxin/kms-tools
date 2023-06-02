<script setup lang="ts">
import { onMounted, ref } from 'vue'
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

const selectedKeys = ref([''])

onMounted(function () {
  const pathName = location.pathname.replace(/\//g, '')
  selectedKeys.value = [pathName === '' ? 'index' : pathName]
})
</script>

<template>
  <ALayoutHeader class="select-none bg-white p-0 shadow-md">
    <div class="mx-auto flex w-256 max-w-full items-center justify-between">
      <img h-12 src="/images/logo.svg" alt="KMS Tools" />
      <AMenu
        v-model:selected-keys="selectedKeys"
        mode="horizontal"
        class="grow [&_.arco-menu-overflow-wrap]:text-end [&_.arco-menu-selected-label]:left-4"
      >
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
