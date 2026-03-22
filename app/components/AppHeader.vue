<script setup lang="ts">
import { motion } from 'motion-v'
import logoUrl from '~/assets/icons/kms-tools.svg'

const route = useRoute()

const { locales, t, setLocale } = useI18n()

const { hidden, hoverLift, press, visible } = useMotionPresets()

const localePath = useLocalePath()

const path = computed(() => route.path.slice(1).split('/'))

const activeSection = computed(() => path.value[0] || '')

const drawerVisible = ref(false)

const navItems = computed(() => [
  {
    name: 'activate',
    label: t('label.activate'),
    icon: 'icons:activate',
  },
  {
    name: 'check',
    label: t('label.check'),
    icon: 'icons:tools',
  },
  {
    name: 'monitor',
    label: t('label.monitor'),
    icon: 'icons:monitor',
  },
])

const themeItems = computed(() => [
  {
    lable: t('label.auto'),
    value: 'system',
  },
  {
    lable: t('label.dark'),
    value: 'dark',
  },
  {
    lable: t('label.light'),
    value: 'light',
  },
])

function handleNavClick(name: string) {
  navigateTo(localePath(name === 'activate' ? '/activate/windows' : `/${name}`))
  drawerVisible.value = false
}
</script>

<template>
  <ALayoutHeader
    class="sticky top-0 z-[100] flex h-20 select-none items-center border-b border-white/10 bg-[--color-bg-2]/80 px-4 shadow-md backdrop-blur-xl"
  >
    <div class="mx-auto flex w-[72rem] max-w-full items-center justify-between">
      <motion.img
        :src="logoUrl"
        alt="KMS Tools"
        class="h-14 w-auto cursor-pointer"
        :initial="hidden(10)"
        :animate="visible(0.02)"
        :whileHover="{ scale: 1.04, rotate: -2 }"
        :whilePress="press"
        @click="navigateTo(localePath('/'))"
      />

      <nav class="hidden grow items-center justify-center gap-2 md:flex">
        <motion.button
          v-for="item in navItems"
          :key="item.name"
          type="button"
          class="relative flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-medium text-[var(--color-text-2)] transition-colors hover:text-[var(--color-text-1)]"
          :initial="hidden(10)"
          :animate="visible(navItems.findIndex(nav => nav.name === item.name) * 0.05 + 0.08)"
          :whileHover="hoverLift(4, 1.02)"
          :whilePress="press"
          @click="handleNavClick(item.name)"
        >
          <motion.span
            v-if="activeSection === item.name"
            layoutId="header-nav-pill"
            class="absolute inset-0 rounded-full bg-[rgb(var(--primary-6))]/14 ring-1 ring-[rgb(var(--primary-6))]/20"
          />
          <span class="relative z-[1] inline-flex items-center gap-2">
            <Icon :name="item.icon" />
            <span>{{ item.label }}</span>
          </span>
        </motion.button>
      </nav>

      <ASpace>
        <ADropdown>
          <motion.div
            :initial="hidden(10)"
            :animate="visible(0.14)"
            :whileHover="hoverLift(3, 1.04)"
            :whilePress="press"
          >
            <AButton size="small" type="secondary">
              <template #icon>
                <ClientOnly>
                  <Icon :name="`icons:${$colorMode.preference}-mode`" />
                  <template #fallback>
                    <Icon :name="`icons:system-mode`" />
                  </template>
                </ClientOnly>
              </template>
            </AButton>
          </motion.div>
          <template #content>
            <ADoption
              v-for="item in themeItems"
              :key="item.value"
              @click="$colorMode.preference = item.value"
            >
              <template #icon>
                <Icon :name="`icons:${item.value}-mode`" />
              </template>
              <template #default>{{ item.lable }}</template>
            </ADoption>
          </template>
        </ADropdown>
        <ADropdown>
          <motion.div
            :initial="hidden(10)"
            :animate="visible(0.18)"
            :whileHover="hoverLift(3, 1.04)"
            :whilePress="press"
          >
            <AButton size="small" type="secondary">
              <template #icon><Icon name="icons:languages" /></template>
            </AButton>
          </motion.div>
          <template #content>
            <ADoption
              v-for="locale in locales"
              :key="locale.code"
              @click.prevent.stop="setLocale(locale.code)"
            >
              <template #icon>
                <Icon :name="`flag:${locale.icon}-4x3`" />
              </template>
              <template #default>{{ locale.name }}</template>
            </ADoption>
          </template>
        </ADropdown>
        <a target="_blank" href="https://github.com/ikxin/kms-tools">
          <motion.div
            :initial="hidden(10)"
            :animate="visible(0.22)"
            :whileHover="hoverLift(3, 1.04)"
            :whilePress="press"
          >
            <AButton size="small" type="secondary">
              <template #icon><Icon name="icons:github" /></template>
            </AButton>
          </motion.div>
        </a>

        <!-- Mobile Hamburger -->
        <div class="md:hidden">
          <motion.div
            :initial="hidden(10)"
            :animate="visible(0.24)"
            :whileHover="hoverLift(3, 1.04)"
            :whilePress="press"
          >
            <AButton size="small" type="secondary" @click="drawerVisible = true">
              <template #icon><Icon name="material-symbols:menu" /></template>
            </AButton>
          </motion.div>
        </div>
      </ASpace>
    </div>
  </ALayoutHeader>

  <!-- Mobile Drawer -->
  <ADrawer
    v-model:visible="drawerVisible"
    placement="right"
    :width="280"
    :title="t('label.menu')"
    :footer="false"
  >
    <AMenu :selected-keys="path" class="!border-none">
      <AMenuItem
        v-for="item in navItems"
        :key="item.name"
        @click="handleNavClick(item.name)"
      >
        <template #icon><Icon :name="item.icon" /></template>
        {{ item.label }}
      </AMenuItem>
    </AMenu>
  </ADrawer>
</template>
