<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  title: 'pages.activate.title.office',
})

const { hidden, visible } = useMotionPresets()

function generateScript(formData: ActivateFormData) {
  const { edition, arch, host, license } = formData

  let path = 'Office16'

  if (edition.includes('2010')) path = 'Office14'
  if (edition.includes('2013')) path = 'Office15'

  return (
    `cd C:\\Program Files${
      arch === 'x86' ? ' (x86)' : ''
    }\\Microsoft Office\\${path}\r\n` +
    `cscript ospp.vbs /inpkey:${license}\r\n` +
    `cscript ospp.vbs /sethst:${host}\r\n` +
    `cscript ospp.vbs /act`
  )
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <motion.div :initial="hidden(18, 0.98)" :animate="visible(0.04)">
      <CommonActivate
        title="Office"
        :gvlksData="OFFICE_GVLKS"
        :generateScript
      ></CommonActivate>
    </motion.div>
    <motion.div :initial="hidden(18, 0.98)" :animate="visible(0.12)">
      <CommonTips></CommonTips>
    </motion.div>
  </div>
</template>
