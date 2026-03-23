<script setup lang="ts">
import type { ValidatedError } from '@arco-design/web-vue'

definePageMeta({
  title: 'pages.check.title',
})

const { t } = useI18n()

const formData = ref({
  host: 'kms.8b5.cn',
  port: '1688',
  protocol: '6',
  edition: '1',
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
      const data = await request()('/api/check', {
        query: formData.value,
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
  <ACard class="h-full w-full">
    <template #title>
      <div class="flex items-center gap-2">
        <Icon name="icons:check" />
        <span>{{ t('title.kms-check') }}</span>
      </div>
    </template>
    <ASpin :loading="resultInfo.loading" dot class="w-full">
      <AForm :model="formData" @submit="handleSubmit" layout="vertical">
        <AFormItem :label="t('label.host')" field="host" required>
          <AInput v-model="formData.host"></AInput>
        </AFormItem>
        <AFormItem :label="t('label.port')" field="port" required>
          <AInput v-model="formData.port"></AInput>
        </AFormItem>
        <AFormItem :label="t('label.edition')" field="edition" required>
          <ASelect v-model="formData.edition">
            <AOption
              v-for="(value, key) in appItems"
              :key="key"
              :value="key"
              :label="value"
            />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('label.protocol')" field="protocol" required>
          <ASelect v-model="formData.protocol">
            <AOption value="6">V6 Protocol</AOption>
            <AOption value="5">V5 Protocol</AOption>
            <AOption value="4">V4 Protocol</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem>
          <AButton html-type="submit" type="primary">
            {{ t('label.submit') }}
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
