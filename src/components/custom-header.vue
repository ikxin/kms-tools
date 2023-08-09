<script setup lang="ts">
import { useAppStore } from '@/store/app'

const { t } = useI18n()

const appStore = useAppStore()

const navItems = computed(() => [
  {
    name: 'activation',
    label: t('main.module.activate'),
    icon: 'i-mdi:microsoft-windows'
  },
  {
    name: 'detection',
    label: t('main.module.tools'),
    icon: 'i-mdi:check-network'
  }
])

const router = useRouter()

const redirectPage = (name: string) => {
  router.push({ path: name === 'home' ? '/' : '/' + name })
}

const pathName = location.pathname.match(/\b\w+\b/g)

const navSelected = ref([!pathName?.[0] ? 'home' : pathName?.[0]])

const themeItems = computed(() => [
  {
    lable: t('main.theme.auto'),
    value: 'auto',
    icon: 'i-ic:round-brightness-auto'
  },
  {
    lable: t('main.theme.dark'),
    value: 'dark',
    icon: 'i-ic:round-dark-mode'
  },
  {
    lable: t('main.theme.light'),
    value: 'light',
    icon: 'i-ic:round-light-mode'
  }
])

const themeIcon = computed(() => {
  return themeItems.value.find(item => item.value === appStore.theme)?.icon
})

const themeChange = val => (appStore.theme = val)

const languagesItems = computed(() => [
  {
    lable: t('main.languages.zh-cn'),
    value: 'zh-cn',
    icon: 'i-flag:cn-4x3'
  },
  {
    lable: t('main.languages.en-us'),
    value: 'en-us',
    icon: 'i-flag:us-4x3'
  }
])

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
