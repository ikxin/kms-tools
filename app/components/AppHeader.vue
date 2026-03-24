<script setup lang="ts">
const route = useRoute()

const { locales, t, setLocale } = useI18n()

const localePath = useLocalePath()

const path = computed(() => route.path.slice(1).split('/'))

const drawerVisible = ref(false)

const navItems = computed(() => [
  {
    name: 'activate',
    label: t('label.activate'),
    icon: 'icons:activate'
  },
  {
    name: 'check',
    label: t('label.check'),
    icon: 'icons:tools'
  },
  {
    name: 'monitor',
    label: t('label.monitor'),
    icon: 'icons:monitor'
  }
])

const themeItems = computed(() => [
  {
    lable: t('label.auto'),
    value: 'system'
  },
  {
    lable: t('label.dark'),
    value: 'dark'
  },
  {
    lable: t('label.light'),
    value: 'light'
  }
])

function handleNavClick(name: string) {
  navigateTo(localePath(name === 'activate' ? '/activate/windows' : `/${name}`))
  drawerVisible.value = false
}
</script>

<template>
  <ALayoutHeader
    class="sticky top-0 z-[100] flex h-20 select-none items-center bg-[--color-bg-2] px-4 shadow-md"
  >
    <div class="mx-auto flex w-[72rem] max-w-full items-center justify-between">
      <img
        src="/assets/icons/kms-tools.svg"
        alt="KMS Tools"
        class="h-14 w-auto cursor-pointer"
        @click="navigateTo(localePath('/'))"
      />

      <!-- Desktop Menu -->
      <AMenu
        :selected-keys="path"
        mode="horizontal"
        class="hidden grow md:flex [&_.arco-menu-overflow-wrap]:text-end [&_.arco-menu-selected-label]:left-4"
      >
        <AMenuItem
          v-for="item in navItems"
          :key="item.name"
          class="!inline-flex items-center gap-1"
          @click="handleNavClick(item.name)"
        >
          <Icon :name="item.icon" />
          <span>{{ item.label }}</span>
        </AMenuItem>
      </AMenu>

      <ASpace>
        <ADropdown>
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
          <AButton size="small" type="secondary">
            <template #icon><Icon name="icons:languages" /></template>
          </AButton>
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
          <AButton size="small" type="secondary">
            <template #icon><Icon name="icons:github" /></template>
          </AButton>
        </a>

        <!-- Mobile Hamburger -->
        <div class="md:hidden">
          <AButton size="small" type="secondary" @click="drawerVisible = true">
            <template #icon><Icon name="material-symbols:menu" /></template>
          </AButton>
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
