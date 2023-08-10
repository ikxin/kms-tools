<script setup lang="ts">
import gvlks from '@/assets/gvlks/windows-server'
import { FieldRule, TableColumnData } from '@arco-design/web-vue'
import { useScript } from '@/composables/useScript'

const { t } = useI18n()

const formData = reactive({
  version: '',
  edition: '',
  service: 'kms.moeclub.org',
  license: '',
})

watchEffect(() => (formData.license = formData.edition))

const formRules = computed((): Record<string, FieldRule | FieldRule[]> => {
  return {
    version: {
      required: true,
      message: t('activate.form.placeholder.version'),
    },
    edition: {
      required: true,
      message: t('activate.form.placeholder.edition'),
    },
    service: {
      required: true,
      message: t('activate.form.placeholder.service'),
    },
  }
})

const activateScript = computed(() => {
  return `@echo off\r\nslmgr /skms ${formData.service}\r\nslmgr /ipk ${formData.license}\r\nslmgr /ato\r\nslmgr /xpr`
})

const activateScriptVisible = ref<boolean>(false)

const handleSubmit = data => {
  if (data.errors === undefined) {
    activateScriptVisible.value = true
  }
}

const tableData = computed(() => {
  if (!gvlks[formData.version]) return []
  return gvlks[formData.version]?.edition.map(item => {
    return { license: item[0], edition: item[1] }
  })
})

const tableColumns = computed(
  (): Array<TableColumnData> => [
    { title: t('activate.table.columns.edition'), dataIndex: 'edition' },
    { title: t('activate.table.columns.license'), dataIndex: 'license' },
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
        <div class="flex items-center gap-2"><i class="i-icons:windows-server" />Windows Server</div>
      </template>
      <AForm :model="formData" :rules="formRules" @submit="handleSubmit" auto-label-width>
        <AFormItem :label="t('activate.form.label.version')" field="version">
          <ASelect v-model="formData.version" :placeholder="t('activate.form.placeholder.version')">
            <AOption v-for="(item, key) in gvlks" :key="key" :label="item.version" :value="key" />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('activate.form.label.edition')" field="edition">
          <ASelect v-model="formData.edition" :placeholder="t('activate.form.placeholder.edition')">
            <AOption
              v-for="(item, index) in gvlks[formData.version]?.edition"
              :key="index"
              :value="item[0]"
              :label="item[1]"
            />
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('activate.form.label.service')" field="service">
          <AInput v-model="formData.service" />
        </AFormItem>
        <AFormItem :label="t('activate.form.label.license')" field="license">
          <AInput v-model="formData.license" disabled />
        </AFormItem>
        <AFormItem>
          <ASpace size="small">
            <AButton html-type="submit" type="primary">{{ t('activate.button.create') }}</AButton>
            <template v-if="activateScriptVisible">
              <AButton @click="downloadScript">{{ t('activate.button.download') }}</AButton>
              <AButton @click="copyScript">{{ t('activate.button.copy') }}</AButton>
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
