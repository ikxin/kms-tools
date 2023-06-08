<script setup lang="ts">
import { navigate } from 'vite-plugin-ssr/client/router'
import { ref, onMounted } from 'vue'

const selectedKeys = ref([''])

onMounted(function () {
  const pathName = location.pathname.match(/\/(\w+)\/?$/)
  selectedKeys.value = [pathName[1]]
})
</script>

<template>
  <ALayoutSider class="[&>.arco-layout-sider-children]:rounded rounded">
    <AMenu
      v-model:selected-keys="selectedKeys"
      :default-open-keys="['system', 'software']"
      :default-selected-keys="['windows']"
      class="[&_.arco-menu-icon>i]:inline-block select-none h-full [&>.arco-menu-inner]:p-2"
    >
      <ASubMenu key="system">
        <template #icon><i class="i-mdi:server" /></template>
        <template #title>系统</template>
        <AMenuItem key="windows" @click="navigate('/activate/windows')">
          <template #icon><i class="i-mdi:microsoft-windows" /></template>
          <span>Windows</span>
        </AMenuItem>
      </ASubMenu>
      <ASubMenu key="software">
        <template #icon><i class="i-mdi:application-brackets" /></template>
        <template #title>软件</template>
        <AMenuItem key="office" @click="navigate('/activate/office')">
          <template #icon><i class="i-mdi:microsoft-office" /></template>
          <span>Office</span>
        </AMenuItem>
      </ASubMenu>
    </AMenu>
  </ALayoutSider>
  <ALayoutContent>
    <slot />
  </ALayoutContent>
</template>
