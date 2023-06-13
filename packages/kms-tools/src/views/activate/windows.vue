<script setup lang="ts">
import gvlks from '@/assets/gvlks/windows'
import { FieldRule, TableColumnData } from '@arco-design/web-vue'
import { useScript } from '@/composables/useScript'

const { t } = useI18n()

/** 表单数据 */
const formData = reactive({
  version: '',
  edition: '',
  service: 'kms.moeclub.org',
  license: ''
})

watchEffect(() => (formData.license = formData.edition))

/** 表单校验规则 */
const formRules = computed((): Record<string, FieldRule | FieldRule[]> => {
  return {
    version: {
      required: true,
      message: t('activate.windows.form-item.version.placeholder')
    },
    edition: {
      required: true,
      message: t('activate.windows.form-item.edition.placeholder')
    },
    service: {
      required: true,
      message: t('activate.windows.form-item.service.placeholder')
    }
  }
})

/** 激活脚本 */
const activateScript = computed(() => {
  return `@echo off\r\nslmgr /skms ${formData.service}\r\nslmgr /ipk ${formData.license}\r\nslmgr /ato\r\nslmgr /xpr`
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
  return gvlks[formData.version]?.edition.map(item => {
    return { license: item[0], edition: item[1] }
  })
})

const tableColumns = computed(
  (): Array<TableColumnData> => [
    { title: t('activate.windows.table.columns.edition'), dataIndex: 'edition' },
    { title: t('activate.windows.table.columns.license'), dataIndex: 'license' }
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
        <AFormItem :label="t('activate.windows.form-item.version.label')" field="version">
          <ASelect v-model="formData.version" :placeholder="t('activate.windows.form-item.version.placeholder')">
            <AOption v-for="(item, key) in gvlks" :key="key" :label="item.version" :value="key" />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('activate.windows.form-item.edition.label')" field="edition">
          <ASelect v-model="formData.edition" :placeholder="t('activate.windows.form-item.edition.placeholder')">
            <AOption
              v-for="(item, index) in gvlks[formData.version]?.edition"
              :key="index"
              :value="item[0]"
              :label="item[1]"
            />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('activate.windows.form-item.service.label')" field="service">
          <AInput v-model="formData.service" />
        </AFormItem>
        <AFormItem :label="t('activate.windows.form-item.license.label')" field="license">
          <AInput v-model="formData.license" disabled />
        </AFormItem>
        <AFormItem>
          <ASpace size="small">
            <AButton html-type="submit" type="primary">创建脚本</AButton>
            <template v-show="activateScriptVisible">
              <AButton @click="downloadScript">下载脚本</AButton>
              <AButton @click="copyScript">复制脚本</AButton>
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
