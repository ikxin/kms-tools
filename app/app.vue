<script lang="ts" setup>
const monitorData = useState('monitorData')

await callOnce(async () => {
  monitorData.value = await $fetch('/api/monitor')
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
