<script setup lang="ts">
const route = useRoute()

const localePath = useLocalePath()

const { t } = useI18n()

const path = computed(() => route.path.slice(1).split('/'))

const drawerVisible = ref(false)

if (!path.value.at(-1)) {
  navigateTo(localePath('/activate/windows'))
}

watch(
  () => route.path,
  () => {
    drawerVisible.value = false
  },
)

function handleMenuClick(key: string) {
  navigateTo(localePath(`/activate/${key}`))
  drawerVisible.value = false
}
</script>

<template>
  <!-- Mobile: floating left-edge tab -->
  <div
    v-show="!drawerVisible"
    class="fixed left-0 top-1/3 z-[100] -translate-y-1/2 cursor-pointer rounded-r-lg bg-[rgb(var(--primary-6))] px-1 py-4 text-white shadow-lg md:hidden"
    @click="drawerVisible = true"
  >
    <Icon name="material-symbols:chevron-right" class="text-base" />
  </div>

  <!-- Mobile: left-side drawer -->
  <ADrawer
    v-model:visible="drawerVisible"
    placement="left"
    :width="240"
    :title="t('label.activate')"
    :footer="false"
  >
    <AMenu
      :selected-keys="path"
      :default-open-keys="['system', 'software']"
      class="select-none !border-none [&_.arco-menu-icon>i]:inline-block"
    >
      <ASubMenu key="system">
        <template #icon><Icon name="icons:system" /></template>
        <template #title>{{ t('label.system') }}</template>
        <AMenuItem key="windows" @click="handleMenuClick('windows')">
          <template #icon><Icon name="icons:windows" /></template>
          Windows
        </AMenuItem>
        <AMenuItem
          key="windows-server"
          @click="handleMenuClick('windows-server')"
        >
          <template #icon><Icon name="icons:windows-server" /></template>
          Windows Server
        </AMenuItem>
      </ASubMenu>
      <ASubMenu key="software">
        <template #icon><Icon name="icons:software" /></template>
        <template #title>{{ t('label.software') }}</template>
        <AMenuItem key="office" @click="handleMenuClick('office')">
          <template #icon><Icon name="icons:office" /></template>
          Office
        </AMenuItem>
      </ASubMenu>
    </AMenu>
  </ADrawer>

  <!-- Mobile: page content -->
  <div class="flex w-full flex-col gap-4 md:hidden">
    <NuxtPage />
  </div>

  <!-- Desktop: Sidebar layout -->
  <ALayoutSider
    :width="240"
    class="hidden rounded md:block [&>.arco-layout-sider-children]:rounded"
  >
    <AMenu
      :selected-keys="path"
      :default-open-keys="['system', 'software']"
      class="h-full select-none [&>.arco-menu-inner]:p-2 [&_.arco-menu-icon>i]:inline-block"
    >
      <ASubMenu key="system">
        <template #icon>
          <Icon name="icons:system" />
        </template>
        <template #title>{{ t('label.system') }}</template>
        <AMenuItem key="windows" @click="handleMenuClick('windows')">
          <template #icon>
            <Icon name="icons:windows" />
          </template>
          <span>Windows</span>
        </AMenuItem>
        <AMenuItem
          key="windows-server"
          @click="handleMenuClick('windows-server')"
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
        <AMenuItem key="office" @click="handleMenuClick('office')">
          <template #icon>
            <Icon name="icons:office" />
          </template>
          <span>Office</span>
        </AMenuItem>
      </ASubMenu>
    </AMenu>
  </ALayoutSider>
  <ALayoutContent class="hidden flex-col gap-4 md:flex">
    <NuxtPage />
  </ALayoutContent>
</template>
