<script setup lang="ts">
const menuItems = [
  {
    key: 'home',
    label: '首页',
    icon: 'i-mdi:home',
  },
  {
    key: 'activate',
    label: '激活',
    icon: 'i-mdi:microsoft-windows',
  },
  {
    key: 'check',
    label: '检测',
    icon: 'i-mdi:check-network',
  },
  {
    key: 'download',
    label: '下载',
    icon: 'i-mdi:folder-download',
  },
  {
    key: 'guide',
    label: '指南',
    icon: 'i-mdi:document',
  },
  {
    key: 'monitor',
    label: '监控',
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
  { lable: '浅色模式', value: 'light', icon: 'i-ic:round-light-mode' },
  { lable: '深色模式', value: 'dark', icon: 'i-ic:round-dark-mode' },
  { lable: '跟随系统', value: 'auto', icon: 'i-ic:round-brightness-auto' },
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
