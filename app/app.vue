<script lang="ts" setup>
const monitorData = useState<MonitorInfo[]>('monitorData')
const { locale } = useI18n()

const echartsLocale = computed(() => {
  if (locale.value === 'zh-cn') return 'ZH'
  return 'EN'
})

provide(
  INIT_OPTIONS_KEY,
  computed(() => ({
    locale: echartsLocale.value
  }))
)

onMounted(async () => {
  const data = await request()('/api/monitor')
  monitorData.value = data
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
