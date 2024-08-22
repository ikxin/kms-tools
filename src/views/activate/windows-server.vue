<script setup lang="ts">
import editionData from '@/assets/gvlks/windows-server.json'

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
    :editionData
    :generateScript
  ></CommonActivate>
</template>
