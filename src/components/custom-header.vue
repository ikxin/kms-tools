<script setup lang="ts">
import { useAppStore } from '@/store/app'

const { t } = useI18n()

const appStore = useAppStore()

const navItems = computed(() => [
  {
    name: 'activate',
    label: t('main.module.activate'),
    icon: 'i-icons:activate',
  },
  {
    name: 'tools',
    label: t('main.module.tools'),
    icon: 'i-icons:tools',
  },
  {
    name: 'monitor',
    label: t('main.module.monitor'),
    icon: 'i-icons:monitor',
  },
])

const router = useRouter()

const redirectPage = (name: string) => {
  navSelected.value = [name]
  router.push({ path: name === 'home' ? '/' : '/' + name })
}

const pathName = location.pathname.match(/\b\w+\b/g)

const navSelected = ref([!pathName?.[0] ? 'home' : pathName?.[0]])

const themeItems = computed(() => [
  {
    lable: t('main.theme.light'),
    value: 'light',
    icon: 'i-icons:light-mode',
  },
  {
    lable: t('main.theme.dark'),
    value: 'dark',
    icon: 'i-icons:dark-mode',
  },
  {
    lable: t('main.theme.auto'),
    value: 'auto',
    icon: 'i-icons:auto-mode',
  },
])

const themeIcon = computed(() => {
  return themeItems.value.find(item => item.value === appStore.theme)?.icon
})

const themeChange = val => (appStore.theme = val)

const languagesItems = computed(() => [
  {
    lable: t('main.languages.zhCn'),
    value: 'zh-cn',
    icon: 'i-languages:zh',
  },
  {
    lable: t('main.languages.en'),
    value: 'en-us',
    icon: 'i-languages:en',
  },
])

const languagesChange = val => (appStore.languages = val)
</script>

<template>
  <ALayoutHeader class="select-none bg-[--color-bg-2] px-2 shadow-md">
    <div class="mx-auto flex w-256 max-w-full items-center justify-between">
      <div class="i-icons:kms-tools w-48 h-12 cursor-pointer" @click="redirectPage('home')"></div>
      <AMenu
        v-model:selected-keys="navSelected"
        mode="horizontal"
        class="grow [&_.arco-menu-overflow-wrap]:text-end [&_.arco-menu-selected-label]:left-4"
      >
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
            <template #icon><i class="i-icons:languages" /></template>
          </AButton>
          <template #content>
            <ADoption v-for="item in languagesItems" :key="item.value" @click="languagesChange(item.value)">
              <template #icon><i :class="item.icon" /></template>
              <template #default>{{ item.lable }}</template>
            </ADoption>
          </template>
        </ADropdown>
        <AButton size="small" type="secondary">
          <template #icon><i class="i-icons:github" /></template>
        </AButton>
      </ASpace>
    </div>
  </ALayoutHeader>
</template>
