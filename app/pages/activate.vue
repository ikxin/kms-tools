<script setup lang="ts">
const route = useRoute()

const localePath = useLocalePath()

const { t } = useI18n()

const path = computed(() => route.path.slice(1).split('/'))

const drawerVisible = ref(false)
const isDesktop = useMediaQuery('(min-width: 768px)')

if (!path.value.at(-1)) {
  navigateTo(localePath('/activate/windows'))
}

watch(
  isDesktop,
  value => {
    if (value) {
      drawerVisible.value = false
    }
  },
  {
    immediate: true,
    flush: 'post'
  }
)

watch(
  () => route.path,
  () => {
    drawerVisible.value = false
  }
)

function handleMenuClick(key: string) {
  navigateTo(localePath(`/activate/${key}`))
  drawerVisible.value = false
}

const rainyunAdUrlBase64 =
  'aHR0cHM6Ly93d3cucmFpbnl1bi5jb20vbW1fP3M9a21zLXRvb2xz'

function handleRainyunAdClick() {
  window.open(atob(rainyunAdUrlBase64), '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <!-- Mobile: floating left-edge tab -->
  <template v-if="!isDesktop">
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
      unmount-on-close
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

      <div class="group relative flex rounded-md transition">
        <button
          type="button"
          class="flex w-full flex-col items-start gap-y-2 text-left"
          @click="handleRainyunAdClick"
        >
          <img
            src="/images/rainyun_1.png"
            alt="RainYun"
            class="h-auto w-full rounded-md object-cover"
          />
        </button>
      </div>
    </ADrawer>
  </template>

  <!-- Mobile: page content -->
  <div class="flex w-full flex-col gap-4 md:hidden">
    <NuxtPage />
  </div>

  <!-- Desktop: Sidebar layout -->
  <ALayoutSider
    :width="240"
    class="hidden rounded md:block [&>.arco-layout-sider-children]:rounded"
  >
    <div class="flex h-full flex-col">
      <AMenu
        :selected-keys="path"
        :default-open-keys="['system', 'software']"
        class="flex-1 select-none [&>.arco-menu-inner]:p-2 [&_.arco-menu-icon>i]:inline-block"
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

      <div class="p-2 pt-0">
        <div class="group relative flex rounded-md transition">
          <button
            type="button"
            class="flex w-full flex-col items-start gap-y-2 text-left"
            @click="handleRainyunAdClick"
          >
            <img
              src="/images/rainyun_1.png"
              alt="RainYun"
              class="h-auto w-full rounded-md object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  </ALayoutSider>
  <ALayoutContent class="hidden flex-col gap-4 md:flex">
    <NuxtPage />
  </ALayoutContent>
</template>
