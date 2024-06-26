<script setup lang="ts">
import gvlks from '@/assets/gvlks/office'
import { FieldRule, TableColumnData } from '@arco-design/web-vue'
import { useScript } from '@/composables/useScript'

const { t } = useI18n()

const formData = reactive({
  version: '',
  product: '',
  cpuarch: false,
  service: 'kms.moeclub.org',
  license: '',
})

watchEffect(() => (formData.license = formData.product))

const formRules = computed((): Record<string, FieldRule | FieldRule[]> => {
  return {
    version: {
      required: true,
      message: t('placeholder.version'),
    },
    product: {
      required: true,
      message: t('placeholder.product'),
    },
    service: {
      required: true,
      message: t('placeholder.service'),
    },
  }
})

const activateScript = computed(() => {
  const path = formData.cpuarch
    ? 'cd C:\\Program Files\\Microsoft Office\\Office16'
    : 'cd C:\\Program Files (x86)\\Microsoft Office\\Office16'
  const fix = `cscript ospp.vbs /inpkey:${formData.license}`
  const activate = `cscript ospp.vbs /sethst:${formData.service}\r\ncscript ospp.vbs /act`
  return `${path}\r\n${fix}\r\n${activate}`
})

const activateScriptVisible = ref<boolean>(false)

const handleSubmit = data => {
  if (data.errors === undefined) {
    activateScriptVisible.value = true
  }
}

const tableData = computed(() => {
  if (!gvlks[formData.version]) return []
  return gvlks[formData.version]?.product.map(item => {
    return { license: item[0], product: item[1] }
  })
})

const tableColumns = computed(
  (): Array<TableColumnData> => [
    { title: t('label.product'), dataIndex: 'product' },
    { title: t('label.license'), dataIndex: 'license' },
  ],
)

const { useScriptDownload, useScriptCopy } = useScript()

const downloadScript = () => useScriptDownload(activateScript.value, 'kms.bat')

const copyScript = () => useScriptCopy(activateScript.value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <ACard>
      <template #title>
        <div class="flex items-center gap-2">
          <i class="i-icons:office" />Office
        </div>
      </template>
      <AForm
        :model="formData"
        :rules="formRules"
        @submit="handleSubmit"
        auto-label-width
      >
        <AFormItem :label="t('label.version')" field="version">
          <ASelect
            v-model="formData.version"
            :placeholder="t('placeholder.version')"
          >
            <AOption
              v-for="(item, key) in gvlks"
              :key="key"
              :label="item.version"
              :value="key"
            />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('label.product')" field="product">
          <ASelect
            v-model="formData.product"
            :placeholder="t('placeholder.product')"
          >
            <AOption
              v-for="(item, index) in gvlks[formData.version]?.product"
              :key="index"
              :value="item[0]"
              :label="item[1]"
            />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('label.cpuarch')" field="cpuarch">
          <ARadioGroup v-model="formData.cpuarch" type="button">
            <ARadio :value="false">{{ t('label.x86') }}</ARadio>
            <ARadio :value="true">{{ t('label.x64') }}</ARadio>
          </ARadioGroup>
        </AFormItem>
        <AFormItem :label="t('label.service')" field="service">
          <AInput v-model="formData.service" />
        </AFormItem>
        <AFormItem :label="t('label.license')" field="license">
          <AInput v-model="formData.license" disabled />
        </AFormItem>
        <AFormItem>
          <ASpace size="small">
            <AButton html-type="submit" type="primary">
              {{ t('button.generate-script') }}
            </AButton>
            <template v-if="activateScriptVisible">
              <AButton @click="downloadScript">
                {{ t('button.download-script') }}
              </AButton>
              <AButton @click="copyScript">
                {{ t('button.copy-script') }}
              </AButton>
            </template>
          </ASpace>
        </AFormItem>
        <AFormItem v-show="activateScriptVisible">
          <ATextarea v-model="activateScript" :auto-size="true" />
        </AFormItem>
      </AForm>
    </ACard>
    <ACard>
      <ATable :data="tableData" :columns="tableColumns" />
    </ACard>
  </div>
</template>
