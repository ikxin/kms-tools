<script setup lang="ts">
import logoHead from '@/assets/icons/logo-head.svg'
</script>

<template>
  <a-layout-header class="bg-white">
    <div class="mx-auto flex max-w-[1080px] items-center justify-between">
      <div class="h-[52px]">
        <img class="h-full" :src="logoHead" alt="KMS Tools" />
      </div>
      <a-menu class="text-end" mode="horizontal" :default-selected-keys="['1']">
        <a-menu-item key="1"><icon-home class="!mr-1" />首页</a-menu-item>
        <a-menu-item key="2"><icon-apps class="!mr-1" />软件激活</a-menu-item>
        <a-menu-item key="3"><icon-download class="!mr-1" />软件下载</a-menu-item>
        <a-menu-item key="4"><icon-bar-chart class="!mr-1" />服务监控</a-menu-item>
        <a-menu-item key="5"><icon-bookmark class="!mr-1" />帮助中心</a-menu-item>
      </a-menu>
    </div>
  </a-layout-header>
</template>
