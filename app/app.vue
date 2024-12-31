<script lang="ts" setup>
const monitorData = useState('monitorData')

await callOnce(async () => {
  monitorData.value = await $fetch('/api/monitor')
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
