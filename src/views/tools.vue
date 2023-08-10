<script setup lang="ts">
import { FieldRule } from '@arco-design/web-vue'
import { appItems } from '@/assets/items/check'
import { useAxios } from '@vueuse/integrations/useAxios'

const { t } = useI18n()

const formData = ref({
  domain: 'kms.ikxin.com',
  port: '1688',
  protocol: '6',
  software: '1',
})

const formRules = computed((): Record<string, FieldRule | FieldRule[]> => {
  return {
    domain: {
      required: true,
      message: t('tools.form.placeholder.domain'),
    },
    port: {
      required: true,
      message: t('tools.form.placeholder.port'),
    },
    protocol: {
      required: true,
      message: t('tools.form.placeholder.protocol'),
    },
    software: {
      required: true,
      message: t('tools.form.placeholder.software'),
    },
  }
})

const resultInfo = reactive<{
  loading: boolean
  message: string
  type: 'normal' | 'error' | 'success' | 'warning' | 'info'
  visible: boolean
}>({
  loading: false,
  message: '',
  type: 'normal',
  visible: false,
})

const handleSubmit = async data => {
  if (data.errors === undefined) {
    resultInfo.loading = true
    const { data } = await useAxios('/api/kms/check', {
      method: 'post',
      data: formData.value,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    Object.assign(resultInfo, data.value)
    resultInfo.visible = true
    resultInfo.loading = false
  }
}
</script>

<template>
  <ACard :title="t('tools.card.title')" class="h-full">
    <ASpin :loading="resultInfo.loading" dot class="w-full">
      <AForm :model="formData" :rules="formRules" @submit="handleSubmit" auto-label-width>
        <AFormItem :label="t('tools.form.label.domain')" field="domain">
          <AInput v-model="formData.domain"></AInput>
        </AFormItem>
        <AFormItem :label="t('tools.form.label.port')" field="port">
          <AInput v-model="formData.port"></AInput>
        </AFormItem>
        <AFormItem :label="t('tools.form.label.protocol')" field="protocol">
          <ASelect v-model="formData.protocol">
            <AOption value="6">V6 Protocol</AOption>
            <AOption value="5">V5 Protocol</AOption>
            <AOption value="4">V4 Protocol</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('tools.form.label.software')" field="software">
          <ASelect v-model="formData.software">
            <AOption v-for="(value, key) in appItems" :key="key" :value="key">{{ value }}</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem>
          <AButton html-type="submit" type="primary">{{ t('tools.button.submit') }}</AButton>
        </AFormItem>
      </AForm>
      <AAlert v-show="resultInfo.visible" :type="resultInfo.type" :title="resultInfo.type" class="whitespace-pre">
        {{ resultInfo.message }}
      </AAlert>
    </ASpin>
  </ACard>
</template>
