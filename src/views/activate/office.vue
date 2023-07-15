<script setup lang="ts">
import gvlks from '@/assets/gvlks/office'
import { FieldRule, TableColumnData } from '@arco-design/web-vue'
import { useScript } from '@/composables/useScript'

const { t } = useI18n()

/** 表单数据 */
const formData = reactive({
  version: '',
  product: '',
  is64bus: false,
  service: 'kms.moeclub.org',
  license: ''
})

watchEffect(() => (formData.license = formData.product))

/** 表单校验规则 */
const formRules = computed((): Record<string, FieldRule | FieldRule[]> => {
  return {
    version: {
      required: true,
      message: t('activate.office.form-item.version.placeholder')
    },
    product: {
      required: true,
      message: t('activate.office.form-item.product.placeholder')
    },
    service: {
      required: true,
      message: t('activate.office.form-item.service.placeholder')
    }
  }
})

/** 激活脚本 */
const activateScript = computed(() => {
  const path = formData.is64bus
    ? 'cd C:\\Program Files\\Microsoft Office\\Office16'
    : 'cd C:\\Program Files (x86)\\Microsoft Office\\Office16'
  const fix = `cscript ospp.vbs /inpkey:${formData.license}`
  const activate = `cscript ospp.vbs /sethst:${formData.service}\r\ncscript ospp.vbs /act`
  return `${path}\r\n${fix}\r\n${activate}`
})

/** 激活脚本显示 */
const activateScriptVisible = ref<boolean>(false)

/** 表单提交 */
const handleSubmit = data => {
  if (data.errors === undefined) {
    activateScriptVisible.value = true
  }
}

/** 表格数据 */
const tableData = computed(() => {
  if (!gvlks[formData.version]) return []
  return gvlks[formData.version]?.product.map(item => {
    return { license: item[0], product: item[1] }
  })
})

const tableColumns = computed(
  (): Array<TableColumnData> => [
    { title: t('activate.office.table.columns.product'), dataIndex: 'product' },
    { title: t('activate.office.table.columns.license'), dataIndex: 'license' }
  ]
)

const { useScriptDownload, useScriptCopy } = useScript()

const downloadScript = () => useScriptDownload(activateScript.value, 'kms.bat')

const copyScript = () => useScriptCopy(activateScript.value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <ACard>
      <AForm :model="formData" :rules="formRules" @submit="handleSubmit" auto-label-width>
        <AFormItem :label="t('activate.office.form-item.version.label')" field="version">
          <ASelect v-model="formData.version" :placeholder="t('activate.office.form-item.version.placeholder')">
            <AOption v-for="(item, key) in gvlks" :key="key" :label="item.version" :value="key" />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('activate.office.form-item.product.label')" field="product">
          <ASelect v-model="formData.product" :placeholder="t('activate.office.form-item.product.placeholder')">
            <AOption
              v-for="(item, index) in gvlks[formData.version]?.product"
              :key="index"
              :value="item[0]"
              :label="item[1]"
            />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('activate.office.form-item.is64bus.label')" field="is64bus">
          <ARadioGroup v-model="formData.is64bus" type="button">
            <ARadio :value="false">{{ t('activate.office.form-item.is64bus.radio.x86') }}</ARadio>
            <ARadio :value="true">{{ t('activate.office.form-item.is64bus.radio.x64') }}</ARadio>
          </ARadioGroup>
        </AFormItem>
        <AFormItem :label="t('activate.office.form-item.service.label')" field="service">
          <AInput v-model="formData.service" />
        </AFormItem>
        <AFormItem :label="t('activate.office.form-item.license.label')" field="license">
          <AInput v-model="formData.license" disabled />
        </AFormItem>
        <AFormItem>
          <ASpace size="small">
            <AButton html-type="submit" type="primary">{{ t('activate.button.create-script') }}</AButton>
            <template v-if="activateScriptVisible">
              <AButton @click="downloadScript">{{ t('activate.button.download-script') }}</AButton>
              <AButton @click="copyScript">{{ t('activate.button.copy-script') }}</AButton>
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
