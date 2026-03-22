<script setup lang="ts">
import { motion } from 'motion-v'

const route = useRoute()

const localePath = useLocalePath()

const { t } = useI18n()

const { hidden, hoverLift, press, visible } = useMotionPresets()

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
  <motion.button
    v-show="!drawerVisible"
    type="button"
    class="fixed left-0 top-1/3 z-[100] -translate-y-1/2 cursor-pointer rounded-r-lg bg-[rgb(var(--primary-6))] px-1 py-4 text-white shadow-lg md:hidden"
    :initial="hidden(0, 0.95)"
    :animate="visible(0.08)"
    :whileHover="{ x: 6, scale: 1.04 }"
    :whilePress="press"
    @click="drawerVisible = true"
  >
    <Icon name="material-symbols:chevron-right" class="text-base" />
  </motion.button>

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
  <motion.div
    class="flex w-full flex-col gap-4 md:hidden"
    :initial="hidden(20, 0.98)"
    :animate="visible(0.04)"
  >
    <NuxtPage />
  </motion.div>

  <!-- Desktop: Sidebar layout -->
  <motion.div
    class="hidden md:block"
    :initial="hidden(20, 0.98)"
    :animate="visible(0.05)"
  >
    <motion.div :whileHover="hoverLift(6, 1.01)">
      <ALayoutSider
        :width="240"
        class="hidden rounded md:block [&>.arco-layout-sider-children]:rounded [&>.arco-layout-sider-children]:!bg-transparent"
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
    </motion.div>
  </motion.div>

  <motion.div
    class="hidden min-w-0 flex-1 md:flex"
    :initial="hidden(24, 0.98)"
    :animate="visible(0.1)"
  >
    <ALayoutContent class="hidden min-w-0 flex-1 flex-col gap-4 md:flex">
      <NuxtPage />
    </ALayoutContent>
  </motion.div>
</template>
