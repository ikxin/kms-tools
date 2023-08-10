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
        <template #icon><i class="i-icons:system text-base" /></template>
        <template #title>{{ t('activate.sider.system') }}</template>
        <AMenuItem key="windows" @click="router.push({ path: '/activate/windows' })">
          <template #icon><i class="i-icons:windows" /></template>
          <span>Windows</span>
        </AMenuItem>
        <AMenuItem key="windows-server" @click="router.push({ path: '/activate/windows-server' })">
          <template #icon><i class="i-icons:windows-server" /></template>
          <span>Windows Server</span>
        </AMenuItem>
      </ASubMenu>
      <ASubMenu key="software">
        <template #icon><i class="i-icons:software text-base" /></template>
        <template #title>{{ t('activate.sider.software') }}</template>
        <AMenuItem key="office" @click="router.push({ path: '/activate/office' })">
          <template #icon><i class="i-icons:office" /></template>
          <span>Office</span>
        </AMenuItem>
      </ASubMenu>
    </AMenu>
  </ALayoutSider>
  <ALayoutContent>
    <RouterView />
  </ALayoutContent>
</template>
