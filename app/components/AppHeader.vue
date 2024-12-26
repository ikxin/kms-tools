<script setup lang="ts">
const { t } = useI18n()

const navItems = computed(() => [
  {
    name: 'activate',
    label: t('label.activate'),
    icon: 'icons:activate',
  },
  {
    name: 'tools',
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
    value: 'auto',
    icon: 'icons:auto-mode',
  },
  {
    lable: t('label.dark'),
    value: 'dark',
    icon: 'icons:dark-mode',
  },
  {
    lable: t('label.light'),
    value: 'light',
    icon: 'icons:light-mode',
  },
])

const locales: LocaleItem[] = [
  {
    lable: '简体中文',
    value: 'zh-cn',
    icon: 'flag:cn-4x3',
  },
  {
    lable: '繁体中文',
    value: 'zh-tw',
    icon: 'flag:tw-4x3',
  },
  {
    lable: 'Deutsch',
    value: 'de',
    icon: 'flag:de-4x3',
  },
  {
    lable: 'English',
    value: 'en',
    icon: 'flag:us-4x3',
  },
  {
    lable: 'Français',
    value: 'fr',
    icon: 'flag:fr-4x3',
  },
  {
    lable: '日本語',
    value: 'ja',
    icon: 'flag:jp-4x3',
  },
  {
    lable: '한국어',
    value: 'ko',
    icon: 'flag:kr-4x3',
  },
  {
    lable: 'Nederlands',
    value: 'nl',
    icon: 'flag:nl-4x3',
  },
  {
    lable: 'Русский',
    value: 'ru',
    icon: 'flag:ru-4x3',
  },
]
</script>

<template>
  <ALayoutHeader class="select-none bg-[--color-bg-2] px-2 shadow-md">
    <div class="mx-auto flex w-[72rem] max-w-full items-center justify-between">
      <Icon class="w-48 h-12 cursor-pointer" name="icons:kms-tools" />

      <AMenu
        mode="horizontal"
        class="grow [&_.arco-menu-overflow-wrap]:text-end [&_.arco-menu-selected-label]:left-4"
      >
        <AMenuItem
          v-for="item in navItems"
          :key="item.name"
          class="!inline-flex items-center gap-1"
        >
          <Icon :name="item.icon" />
          <span>{{ item.label }}</span>
        </AMenuItem>
      </AMenu>
      <ASpace>
        <ADropdown>
          <AButton size="small" type="secondary">
            <template #icon></template>
          </AButton>
          <template #content>
            <ADoption v-for="item in themeItems" :key="item.value">
              <template #icon>
                <Icon :name="item.icon" />
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
            <ADoption v-for="locale in locales" :key="locale.value">
              <template #icon>
                <Icon :name="locale.icon!" />
              </template>
              <template #default>{{ locale.lable }}</template>
            </ADoption>
          </template>
        </ADropdown>
        <a target="_blank" href="https://github.com/ikxin/kms-tools">
          <AButton size="small" type="secondary">
            <template #icon><Icon name="icons:github" /></template>
          </AButton>
        </a>
      </ASpace>
    </div>
  </ALayoutHeader>
</template>
