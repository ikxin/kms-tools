<script setup lang="ts">
const { t } = useI18n()

const menuItems = [
  {
    key: 'home',
    label: t('main.nav.home'),
    icon: 'i-mdi:home',
  },
  {
    key: 'activate',
    label: t('main.nav.activate'),
    icon: 'i-mdi:microsoft-windows',
  },
  {
    key: 'check',
    label: t('main.nav.check'),
    icon: 'i-mdi:check-network',
  },
  {
    key: 'download',
    label: t('main.nav.download'),
    icon: 'i-mdi:folder-download',
  },
  {
    key: 'guide',
    label: t('main.nav.guide'),
    icon: 'i-mdi:document',
  },
  {
    key: 'monitor',
    label: t('main.nav.monitor'),
    icon: 'i-mdi:monitor-dashboard',
  },
]

const router = useRouter()

const redirectPage = (name: string) => router.push({ name })

const selectedKeys = ref([''])

onMounted(function () {
  const pathName = location.pathname.match(/\b\w+\b/g)
  selectedKeys.value = [!pathName?.[0] ? 'home' : pathName?.[0]]
})

const colorMode = useColorMode({
  selector: 'body',
  attribute: 'arco-theme',
  emitAuto: true,
})

const colorModeIcon = ref('')

const colorModeItem = [
  {
    lable: t('main.colorMode.auto'),
    value: 'auto',
    icon: 'i-ic:round-brightness-auto',
  },
  {
    lable: t('main.colorMode.dark'),
    value: 'dark',
    icon: 'i-ic:round-dark-mode',
  },
  {
    lable: t('main.colorMode.light'),
    value: 'light',
    icon: 'i-ic:round-light-mode',
  },
]

function changeColorMode(val) {
  colorMode.value = val
  colorModeIcon.value = colorModeItem.find((item) => item.value === val)?.icon
}

onMounted(() => changeColorMode(localStorage.getItem('vueuse-color-scheme')))
</script>

<template>
  <ALayoutHeader class="select-none bg-[--color-bg-2] px-2 shadow-md">
    <div class="mx-auto flex w-256 max-w-full items-center justify-between">
      <img h-12 src="/images/logo.svg" />
      <AMenu
        v-model:selected-keys="selectedKeys"
        mode="horizontal"
        class="grow [&_.arco-menu-overflow-wrap]:text-end [&_.arco-menu-selected-label]:left-4"
      >
        <template #expand-icon-down>
          <i class="i-mdi:chevron-down inline-block" />
        </template>
        <AMenuItem
          v-for="item in menuItems"
          :key="item.key"
          class="!inline-flex items-center gap-1"
          @click="redirectPage(item.key)"
        >
          <i :class="item.icon" />
          <span>{{ item.label }}</span>
        </AMenuItem>
      </AMenu>
      <ASpace>
        <ADropdown>
          <AButton size="small" type="secondary">
            <template #icon><i :class="colorModeIcon" /></template>
          </AButton>
          <template #content>
            <ADoption
              v-for="item in colorModeItem"
              :key="item.value"
              @click="changeColorMode(item.value)"
            >
              <template #icon><i :class="item.icon" /></template>
              <template #default>{{ item.lable }}</template>
            </ADoption>
          </template>
        </ADropdown>
        <AButton size="small" type="secondary">
          <template #icon><i class="i-mdi:google-translate" /></template>
        </AButton>
        <AButton size="small" type="secondary">
          <template #icon><i class="i-mdi:github-box" /></template>
        </AButton>
      </ASpace>
    </div>
  </ALayoutHeader>
</template>
