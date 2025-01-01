<script setup lang="ts">
import zhEditionData from 'assets/gvlks/office.json'
import enEditionData from 'assets/gvlks/office.en.json'

const { locale } = useI18n()

const editionData = computed(() => {
  if (locale.value === 'zh-cn' || locale.value === 'zh-tw') {
    return zhEditionData
  } else {
    return enEditionData
  }
})

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
  <CommonActivate title="Office" :editionData :generateScript></CommonActivate>
  <CommonTips></CommonTips>
</template>
