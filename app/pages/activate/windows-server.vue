<script setup lang="ts">
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
  <CommonActivate
    title="Windows Server"
    :gvlksData="WINDOWS_SERVER_GVLKS"
    :generateScript
  ></CommonActivate>
  <CommonTips></CommonTips>
</template>
