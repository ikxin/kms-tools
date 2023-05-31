<script setup lang="ts">
const menuItems = [
  {
    key: 'index',
    label: '首页',
  },
  {
    key: 'activation',
    label: '软件激活',
  },
  {
    key: 'software',
    label: '软件下载',
  },
  {
    key: 'monitor',
    label: '服务监控',
  },
  {
    key: 'guide',
    label: '帮助中心',
  },
]

function redirectPage(url: string) {
  window.location.href = url === 'index' ? '/' : url
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
          @click="redirectPage(item.key)"
        >
          {{ item.label }}
        </AMenuItem>
      </AMenu>
    </div>
  </ALayoutHeader>
</template>
