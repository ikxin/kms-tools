<script setup lang="ts">
import logoHead from '@/assets/icons/logo-head.svg'
import { Brightness, DarkMode, Translate, GithubOne, SettingTwo } from '@icon-park/vue-next'
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BasicColorSchema, useColorMode } from '@vueuse/core'
import { menuOption, colorModeOption } from './modules/helper'

const router = useRouter()
const route = useRoute()

/**
 * 跳转页面
 * @param name 菜单名
 */
function redirectPage(name: string) {
  router.push({ name })
}

/** 当前选中菜单 */
const selectedKeys = ref([])

/** 路由监听器 */
watch(
  () => route.name,
  () => {
    selectedKeys.value = [route.name]
  }
)

/** 颜色模式 */
const colorMode = useColorMode({
  selector: 'body',
  attribute: 'arco-theme',
  emitAuto: true,
})

/** 颜色模式按钮图标 */
const colorModeIcon = computed(() => {
  if (colorMode.value === 'dark') {
    document.body.setAttribute('arco-theme', 'dark')
    return DarkMode
  } else if (colorMode.value === 'light') {
    document.body.removeAttribute('arco-theme')
    return Brightness
  } else {
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
        <template v-for="menu in menuOption" :key="menu.name">
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
            <ADoption v-for="item in colorModeOption" :key="item.value" @click="changeColorMode(item.value)">
              <template #icon><component :is="item.icon" /></template>
              <template #default>{{ item.lable }}</template>
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
