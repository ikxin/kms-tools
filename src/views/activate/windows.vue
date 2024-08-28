<script setup lang="ts">
import zhEditionData from '@/assets/gvlks/windows.json'
import enEditionData from '@/assets/gvlks/windows.en.json'

const { locale } = useI18n()

const editionData = computed(() => {
  if (locale.value === 'zh-cn' || locale.value === 'zh-tw') {
    return zhEditionData
  } else {
    return enEditionData
  }
})

function generateScript(formData: ActivateFormData) {
  const { host, license } = formData
  return (
    `@echo off\r\n` +
    `slmgr /skms ${host}\r\n` +
    `slmgr /ipk ${license}\r\n` +
    `slmgr /ato\r\n` +
    `slmgr /xpr`
  )
}
</script>

<template>
  <CommonActivate title="Windows" :editionData :generateScript></CommonActivate>
  <CommonTips></CommonTips>
</template>
