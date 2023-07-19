<script setup lang="ts">
import { FieldRule } from '@arco-design/web-vue'
import { appItems, protocolItems } from '@/assets/items/check'
import { useAxios } from '@vueuse/integrations/useAxios'

const { t } = useI18n()

const formData = reactive({
  host: 'kms.ikxin.com',
  port: '1688',
  app: '1',
  protocol: '6'
})

const formRules = computed((): Record<string, FieldRule | FieldRule[]> => {
  return {
    host: {
      required: true,
      message: t('check.form.host.placeholder')
    },
    port: {
      required: true,
      message: t('check.form.port.placeholder')
    },
    app: {
      required: true,
      message: t('check.form.app.placeholder')
    },
    protocol: {
      required: true,
      message: t('check.form.protocol.placeholder')
    }
  }
})

const visible = ref(false)
const loading = ref(false)

const alertInfo = reactive<{
  type: 'normal' | 'error' | 'success' | 'warning' | 'info'
  meaasge: string
}>({
  type: 'normal',
  meaasge: ''
})

const handleSubmit = async data => {
  if (data.errors === undefined) {
    loading.value = true
    const { data } = await useAxios('/api/kms-check', { method: 'get', params: formData })
    alertInfo.meaasge = data.value.stdout
    alertInfo.type = data.value.result
    visible.value = true
    loading.value = false
  }
}
</script>

<template>
  <ACard :title="t('check.title')" class="h-full">
    <ASpin :loading="loading" dot class="w-full">
      <AForm :model="formData" :rules="formRules" auto-label-width>
        <AFormItem :label="t('check.form.host.label')" field="host">
          <AInput v-model="formData.host"></AInput>
        </AFormItem>
        <AFormItem :label="t('check.form.port.label')" field="port">
          <AInput v-model="formData.port"></AInput>
        </AFormItem>
        <AFormItem :label="t('check.form.app.label')" field="app">
          <ASelect v-model="formData.app">
            <AOption v-for="(value, key) in appItems" :key="key" :value="key">{{ value }}</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('check.form.protocol.label')" field="protocol">
          <ASelect v-model="formData.protocol">
            <AOption v-for="(value, key) in protocolItems" :key="key" :value="key">{{ value }}</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem>
          <ASpace>
            <AButton type="primary" @click="handleSubmit">提交</AButton>
          </ASpace>
        </AFormItem>
      </AForm>
      <AAlert v-show="visible" :type="alertInfo.type">
        <template #title> {{ alertInfo.type }} </template>
        {{ alertInfo.meaasge }}
      </AAlert>
    </ASpin>
  </ACard>
</template>
