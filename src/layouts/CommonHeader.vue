<script setup lang="ts">
import logoHead from '@/assets/icons/logo-head.svg'
import {
  Home,
  ApplicationOne,
  DownloadWeb,
  DataServer,
  DocSearchTwo,
  Brightness,
  DarkMode,
  Translate,
  GithubOne,
  SettingTwo,
} from '@icon-park/vue-next'
import { ref, watch, computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BasicColorSchema, useColorMode, usePreferredDark } from '@vueuse/core'

interface Menu {
  name: string
  title: string
  icon: Component
}

const menuData: Array<Menu> = [
  {
    name: 'home',
    title: '首页',
    icon: Home,
  },
  {
    name: 'activation',
    title: '软件激活',
    icon: ApplicationOne,
  },
  {
    name: 'download',
    title: '软件下载',
    icon: DownloadWeb,
  },
  {
    name: 'service',
    title: '服务监控',
    icon: DataServer,
  },
  {
    name: 'help',
    title: '帮助中心',
    icon: DocSearchTwo,
  },
]

const router = useRouter()
const route = useRoute()

function redirectPage(name: string) {
  router.push({ name })
}

const selectedKeys = ref([])

watch(
  () => route.name,
  () => {
    selectedKeys.value = [route.name]
  }
)

/** 颜色模式 */
const colorMode = useColorMode({
  emitAuto: true,
})

/** 是否深色模式 */
const isDark = usePreferredDark()

/** 颜色模式按钮图标 */
const colorModeIcon = computed(() => {
  if (colorMode.value === 'dark') {
    document.body.setAttribute('arco-theme', 'dark')
    return DarkMode
  } else if (colorMode.value === 'light') {
    document.body.removeAttribute('arco-theme')
    return Brightness
  } else {
    if (isDark.value) {
      document.body.setAttribute('arco-theme', 'dark')
    } else {
      document.body.removeAttribute('arco-theme')
    }
    return SettingTwo
  }
})

/**
 * 更改颜色模式
 * @param mode 颜色模式
 */
function changeColorMode(color: BasicColorSchema) {
  colorMode.value = color
}
</script>

<template>
  <a-layout-header class="select-none bg-white p-0 dark:bg-[#232324]">
    <div class="mx-auto flex w-container max-w-full items-center justify-between">
      <img class="h-12" :src="logoHead" alt="KMS Tools" />
      <a-menu
        :selected-keys="selectedKeys"
        class="grow whitespace-nowrap xs:max-md:w-36"
        theme="light"
        mode="horizontal"
      >
        <template v-for="menu in menuData" :key="menu.name">
          <a-menu-item @click="redirectPage(menu.name)">
            {{ menu.title }}
            <template #icon><component :is="menu.icon"></component></template>
          </a-menu-item>
        </template>
      </a-menu>
      <a-space class="mr-4">
        <ADropdown>
          <AButton size="small" type="secondary">
            <template #icon>
              <component :is="colorModeIcon"></component>
            </template>
          </AButton>
          <template #content>
            <ADoption @click="changeColorMode('light')">
              <template #icon><Brightness /></template>
              <template #default>浅色模式</template>
            </ADoption>
            <ADoption @click="changeColorMode('dark')">
              <template #icon><DarkMode /></template>
              <template #default>深色模式</template>
            </ADoption>
            <ADoption @click="changeColorMode('auto')">
              <template #icon><SettingTwo /></template>
              <template #default>跟随系统</template>
            </ADoption>
          </template>
        </ADropdown>
        <a-button size="small" type="secondary">
          <template #icon>
            <Translate />
          </template>
        </a-button>
        <a-button size="small" type="secondary">
          <template #icon>
            <GithubOne />
          </template>
        </a-button>
      </a-space>
    </div>
  </a-layout-header>
</template>

<style scoped>
:deep(.arco-menu-overflow-wrap) {
  display: flex;
  justify-content: flex-end;
}

:deep(.arco-menu-icon) {
  margin-right: 8px !important;
}
</style>
