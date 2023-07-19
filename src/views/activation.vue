<script setup lang="ts">
const router = useRouter()

const { t } = useI18n()

const pathName = location.pathname.slice(1).split('/')

const selectedKeys = ref(pathName)
</script>

<template>
  <ALayoutSider :width="240" class="[&>.arco-layout-sider-children]:rounded rounded">
    <AMenu
      v-model:selected-keys="selectedKeys"
      :default-open-keys="['system', 'software']"
      :default-selected-keys="['windows']"
      class="[&_.arco-menu-icon>i]:inline-block select-none h-full [&>.arco-menu-inner]:p-2"
    >
      <ASubMenu key="system">
        <template #expand-icon-down>
          <i class="i-mdi:chevron-down inline-block" />
        </template>
        <template #icon><i class="i-mdi:server" /></template>
        <template #title>{{ t('activate.sidebar.system') }}</template>
        <AMenuItem key="windows" @click="router.push({ path: '/activation/windows' })">
          <template #icon><i class="i-mdi:microsoft-windows" /></template>
          <span>Windows</span>
        </AMenuItem>
        <AMenuItem key="windows-server" @click="router.push({ path: '/activation/windows-server' })">
          <template #icon><i class="i-mdi:microsoft-windows" /></template>
          <span>Windows Server</span>
        </AMenuItem>
      </ASubMenu>
      <ASubMenu key="software">
        <template #expand-icon-down>
          <i class="i-mdi:chevron-down inline-block" />
        </template>
        <template #icon><i class="i-mdi:application-brackets" /></template>
        <template #title>{{ t('activate.sidebar.software') }}</template>
        <AMenuItem key="office" @click="router.push({ path: '/activation/office' })">
          <template #icon><i class="i-mdi:microsoft-office" /></template>
          <span>Office</span>
        </AMenuItem>
      </ASubMenu>
    </AMenu>
  </ALayoutSider>
  <ALayoutContent>
    <RouterView />
  </ALayoutContent>
</template>
