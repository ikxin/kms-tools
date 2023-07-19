<script setup lang="ts">
import { useAppStore } from '@/store/app'

const { t } = useI18n()

const appStore = useAppStore()

/** 导航选项 */
const navItems = computed(() => [
  {
    name: 'home',
    label: t('app.nav.home'),
    icon: 'i-mdi:home'
  },
  {
    name: 'activation',
    label: t('app.nav.activate'),
    icon: 'i-mdi:microsoft-windows'
  },
  {
    name: 'detection',
    label: t('app.nav.check'),
    icon: 'i-mdi:check-network'
  },
  {
    name: 'download',
    label: t('app.nav.download'),
    icon: 'i-mdi:folder-download'
  },
  {
    name: 'guide',
    label: t('app.nav.guide'),
    icon: 'i-mdi:document'
  },
  {
    name: 'monitor',
    label: t('app.nav.monitor'),
    icon: 'i-mdi:monitor-dashboard'
  }
])

/** 路由 */
const router = useRouter()

/** 跳转页面 */
const redirectPage = (name: string) => {
  router.push({ path: name === 'home' ? '/' : '/' + name })
}

/** 路径解析 */
const pathName = location.pathname.match(/\b\w+\b/g)

/** 导航选中项 */
const navSelected = ref([!pathName?.[0] ? 'home' : pathName?.[0]])

/** 主题选项 */
const themeItems = computed(() => [
  {
    lable: t('app.theme.auto'),
    value: 'auto',
    icon: 'i-ic:round-brightness-auto'
  },
  {
    lable: t('app.theme.dark'),
    value: 'dark',
    icon: 'i-ic:round-dark-mode'
  },
  {
    lable: t('app.theme.light'),
    value: 'light',
    icon: 'i-ic:round-light-mode'
  }
])

/** 主题图标 */
const themeIcon = computed(() => {
  return themeItems.value.find(item => item.value === appStore.theme)?.icon
})

/** 切换主题 */
const themeChange = val => (appStore.theme = val)

/** 语言选项 */
const languagesItems = computed(() => [
  {
    lable: t('app.languages.zh-cn'),
    value: 'zh-cn',
    icon: 'i-flag:cn-4x3'
  },
  {
    lable: t('app.languages.en-us'),
    value: 'en-us',
    icon: 'i-flag:us-4x3'
  }
])

/** 切换语言 */
const languagesChange = val => (appStore.languages = val)
</script>

<template>
  <ALayoutHeader class="select-none bg-[--color-bg-2] px-2 shadow-md">
    <div class="mx-auto flex w-256 max-w-full items-center justify-between">
      <img h-12 src="../assets/icons/logo.svg" />
      <AMenu
        v-model:selected-keys="navSelected"
        mode="horizontal"
        class="grow [&_.arco-menu-overflow-wrap]:text-end [&_.arco-menu-selected-label]:left-4"
      >
        <template #expand-icon-down>
          <i class="i-mdi:chevron-down inline-block" />
        </template>
        <AMenuItem
          v-for="item in navItems"
          :key="item.name"
          class="!inline-flex items-center gap-1"
          @click="redirectPage(item.name)"
        >
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </AMenuItem>
      </AMenu>
      <ASpace>
        <ADropdown>
          <AButton size="small" type="secondary">
            <template #icon><i :class="themeIcon" /></template>
          </AButton>
          <template #content>
            <ADoption v-for="item in themeItems" :key="item.value" @click="themeChange(item.value)">
              <template #icon><i :class="item.icon" /></template>
              <template #default>{{ item.lable }}</template>
            </ADoption>
          </template>
        </ADropdown>
        <ADropdown>
          <AButton size="small" type="secondary">
            <template #icon><i class="i-mdi:google-translate" /></template>
          </AButton>
          <template #content>
            <ADoption v-for="item in languagesItems" :key="item.value" @click="languagesChange(item.value)">
              <template #icon><i :class="item.icon" /></template>
              <template #default>{{ item.lable }}</template>
            </ADoption>
          </template>
        </ADropdown>
        <AButton size="small" type="secondary">
          <template #icon><i class="i-mdi:github-box" /></template>
        </AButton>
      </ASpace>
    </div>
  </ALayoutHeader>
</template>
