<script setup lang="ts">
const route = useRoute()

const localePath = useLocalePath()

const { t } = useI18n()

const path = computed(() => route.path.slice(1).split('/'))

if (!path.value.at(-1)) {
  navigateTo(localePath('/activate/windows'))
}
</script>

<template>
  <ALayoutSider
    :width="240"
    class="[&>.arco-layout-sider-children]:rounded rounded"
  >
    <AMenu
      :selected-keys="path"
      :default-open-keys="['system', 'software']"
      class="[&_.arco-menu-icon>i]:inline-block select-none h-full [&>.arco-menu-inner]:p-2"
    >
      <ASubMenu key="system">
        <template #icon>
          <Icon name="icons:system" />
        </template>
        <template #title>{{ t('label.system') }}</template>
        <AMenuItem
          key="windows"
          @click="navigateTo(localePath('/activate/windows'))"
        >
          <template #icon>
            <Icon name="icons:windows" />
          </template>
          <span>Windows</span>
        </AMenuItem>
        <AMenuItem
          key="windows-server"
          @click="navigateTo(localePath('/activate/windows-server'))"
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
        <AMenuItem
          key="office"
          @click="navigateTo(localePath('/activate/office'))"
        >
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
