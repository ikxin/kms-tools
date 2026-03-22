<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  title: 'pages.activate.title.windows-server',
})

const { hidden, visible } = useMotionPresets()

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
  <div class="flex w-full flex-col gap-4">
    <motion.div :initial="hidden(18, 0.98)" :animate="visible(0.04)">
      <CommonActivate
        title="Windows Server"
        :gvlksData="WINDOWS_SERVER_GVLKS"
        :generateScript
      ></CommonActivate>
    </motion.div>
    <motion.div :initial="hidden(18, 0.98)" :animate="visible(0.12)">
      <CommonTips></CommonTips>
    </motion.div>
  </div>
</template>
