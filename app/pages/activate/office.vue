<script setup lang="ts">
definePageMeta({
  title: 'pages.activate.title.office',
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
  <CommonActivate
    title="Office"
    :gvlksData="OFFICE_GVLKS"
    :generateScript
  ></CommonActivate>
  <CommonTips></CommonTips>
</template>
