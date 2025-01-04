<script lang="ts" setup>
const monitorData = useState<MonitorInfo[]>('monitorData')

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
