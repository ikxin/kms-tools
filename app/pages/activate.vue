<script setup lang="ts">
const route = useRoute()

const { t } = useI18n()

const pathName = route.path.slice(1).split('/')

const selectedKeys = ref(pathName)
</script>

<template>
  <ALayoutSider
    :width="240"
    class="[&>.arco-layout-sider-children]:rounded rounded"
  >
    <AMenu
      v-model:selected-keys="selectedKeys"
      :default-open-keys="['system', 'software']"
      :default-selected-keys="['windows']"
      class="[&_.arco-menu-icon>i]:inline-block select-none h-full [&>.arco-menu-inner]:p-2"
    >
      <ASubMenu key="system">
        <template #icon>
          <Icon name="icons:system" />
        </template>
        <template #title>{{ t('label.system') }}</template>
        <AMenuItem key="windows" @click="navigateTo('/activate/windows')">
          <template #icon>
            <Icon name="icons:windows" />
          </template>
          <span>Windows</span>
        </AMenuItem>
        <AMenuItem
          key="windows-server"
          @click="navigateTo('/activate/windows-server')"
        >
          <template #icon>
            <Icon name="icons:windows-server" />
          </template>
          <span>Windows Server</span>
        </AMenuItem>
      </ASubMenu>
      <ASubMenu key="software">
        <template #icon>
          <Icon name="icons:software" />
        </template>
        <template #title>{{ t('label.software') }}</template>
        <AMenuItem key="office" @click="navigateTo('/activate/office')">
          <template #icon>
            <Icon name="icons:office" />
          </template>
          <span>Office</span>
        </AMenuItem>
      </ASubMenu>
    </AMenu>
  </ALayoutSider>
  <ALayoutContent class="flex flex-col gap-4">
    <NuxtPage />
  </ALayoutContent>
</template>
