<script setup lang="ts">
const { t } = useI18n()

const formData = reactive({
  host: '',
  port: '',
  app: '',
  protocol: ''
})
</script>

<template>
  <ACard :title="t('check.title')" class="h-full">
    <AForm :model="formData">
      <AFormItem :label="t('check.form.host.label')" field="host">
        <AInput v-model="formData.host"></AInput>
      </AFormItem>
      <AFormItem :label="t('check.form.port.label')" field="port">
        <AInput v-model="formData.port"></AInput>
      </AFormItem>
      <AFormItem :label="t('check.form.app.label')" field="app">
        <AInput v-model="formData.app"></AInput>
      </AFormItem>
      <AFormItem :label="t('check.form.protocol.label')" field="protocol">
        <AInput v-model="formData.app"></AInput>
      </AFormItem>
    </AForm>
  </ACard>
</template>
