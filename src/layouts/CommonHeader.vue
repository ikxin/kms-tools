<script setup lang="ts">
import logoHead from '@/assets/icons/logo-head.svg'
import {
  Home,
  ApplicationOne,
  DownloadWeb,
  DataServer,
  DocSearchTwo,
  SunOne,
  Moon,
  Translate,
  GithubOne,
} from '@icon-park/vue-next'
import { ref, shallowRef, watch, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePreferredDark } from '@vueuse/core'

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

const prefersDark = usePreferredDark()

const darkModeIcon = shallowRef()

watch(
  prefersDark,
  (val) => {
    darkModeIcon.value = val ? Moon : SunOne
  },
  { immediate: true }
)
</script>

<template>
  <a-layout-header class="select-none bg-white p-0">
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
        <a-button size="small" type="secondary">
          <template #icon>
            <component :is="darkModeIcon"></component>
          </template>
        </a-button>
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
