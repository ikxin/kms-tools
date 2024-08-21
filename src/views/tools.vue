<script setup lang="ts">
import { appItems } from '@/assets/items/check'
import fetch from '@/utils/fetch'
import { FieldRule, ValidatedError } from '@arco-design/web-vue'

const { t } = useI18n()

const formData = ref({
  host: 'kms.8b5.cn',
  port: '1688',
  protocol: '6',
  software: '1',
})

const formRules = computed((): Record<string, FieldRule | FieldRule[]> => {
  return {
    host: {
      required: true,
      message: t('placeholder.domain'),
    },
    port: {
      required: true,
      message: t('placeholder.port'),
    },
    protocol: {
      required: true,
      message: t('placeholder.protocol'),
    },
    software: {
      required: true,
      message: t('placeholder.software'),
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

const handleSubmit = async (data: {
  values: Record<string, any>
  errors: Record<string, ValidatedError> | undefined
}) => {
  if (data.errors === undefined) {
    resultInfo.loading = true
    try {
      const { data } = await fetch({
        url: '/api/check',
        method: 'post',
        data: formData.value,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      resultInfo.message = data.content
      resultInfo.type = data.status ? 'success' : 'error'
      resultInfo.visible = true
      resultInfo.loading = false
    } catch (err) {
      resultInfo.loading = false
    }
  }
}
</script>

<template>
  <ACard class="h-full">
    <template #title>
      <div class="flex items-center gap-2">
        <i class="i-icons:check" />{{ t('title.kms-check') }}
      </div>
    </template>
    <ASpin :loading="resultInfo.loading" dot class="w-full">
      <AForm
        :model="formData"
        :rules="formRules"
        @submit="handleSubmit"
        auto-label-width
      >
        <AFormItem :label="t('label.domain')" field="host">
          <AInput v-model="formData.host"></AInput>
        </AFormItem>
        <AFormItem :label="t('label.port')" field="port">
          <AInput v-model="formData.port"></AInput>
        </AFormItem>
        <AFormItem :label="t('label.software')" field="software">
          <ASelect v-model="formData.software">
            <AOption
              v-for="(value, key) in appItems"
              :key="key"
              :value="key"
              :label="value"
            />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('label.protocol')" field="protocol">
          <ASelect v-model="formData.protocol">
            <AOption value="6">V6 Protocol</AOption>
            <AOption value="5">V5 Protocol</AOption>
            <AOption value="4">V4 Protocol</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem>
          <AButton html-type="submit" type="primary">
            {{ t('button.submit') }}
          </AButton>
        </AFormItem>
      </AForm>
      <AAlert
        v-show="resultInfo.visible"
        :type="resultInfo.type"
        :title="resultInfo.type"
        class="whitespace-pre"
      >
        {{ resultInfo.message }}
      </AAlert>
    </ASpin>
  </ACard>
</template>
