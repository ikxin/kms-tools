<script setup lang="ts">
import officeData from '@/data/office.json'
import { FieldRule, TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import { computed, reactive, Ref, ref, watch } from 'vue'
import { useScript } from '@/hooks/useScript'

const formData = reactive({
  officeVersion: '',
  systemVersion: '',
  kmsUrl: 'kms.moeclub.org',
  secretKey: '',
})

const systemVersionOptions = ['64位', '32位']

const formRules: Record<string, FieldRule | FieldRule[]> = {
  officeVersion: {
    required: true,
    message: '请选择 Office 版本',
  },
  systemVersion: {
    required: true,
    message: '请选择系统版本',
  },
  kmsUrl: {
    required: true,
    message: '请选择 KMS 服务器',
  },
  secretKey: {
    required: true,
    message: '请在下方选择 Office 版本',
  },
}

const activationScript = computed(() => {
  let path
  if (formData.systemVersion === '64位') {
    path = 'cd C:\\Program Files\\Microsoft Office\\Office16'
  } else {
    path = 'cd C:\\Program Files (x86)\\Microsoft Office\\Office16'
  }
  const fix = `cscript ospp.vbs /inpkey:${formData.secretKey}`
  const activation = `cscript ospp.vbs /sethst:${formData.kmsUrl}\r\ncscript ospp.vbs /act`
  return `${path}\r\n${fix}\r\n${activation}`
})

const activationScriptVisible: Ref<boolean> = ref(false)

const handleSubmit = (data) => {
  if (data.errors === undefined) {
    activationScriptVisible.value = true
  }
}

const { useScriptDownload, useScriptCopy } = useScript()

const downloadScript = () => {
  useScriptDownload(activationScript.value, 'kms.bat')
}

const copyScript = () => {
  useScriptCopy(activationScript.value)
}

const tableData = ref([])

const tableColumns: Array<TableColumnData> = [
  { title: 'Office 版本', dataIndex: 'release' },
  { title: '密钥', dataIndex: 'key' },
]

const tableRowKey = 'release'

const tableRowSelection: TableRowSelection = {
  type: 'radio',
}

const tableSelectionChange = (val) => {
  tableData.value.forEach((item) => {
    if (val[0] === item.release) {
      formData.secretKey = item.key
    }
  })
}

watch(
  () => formData.officeVersion,
  () => {
    officeData.forEach((item) => {
      if (formData.officeVersion === item.version) {
        tableData.value = item.item
      }
    })
  }
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <a-card>
      <a-form :model="formData" :rules="formRules" @submit="handleSubmit" auto-label-width>
        <a-form-item label="Office 版本" field="officeVersion">
          <a-select v-model="formData.officeVersion" placeholder="请选择系统类型">
            <template v-for="item in officeData" :key="item.version">
              <a-option>{{ item.version }}</a-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="系统版本" field="systemVersion">
          <a-radio-group v-model="formData.systemVersion" :options="systemVersionOptions" />
        </a-form-item>
        <a-form-item label="KMS 服务器" field="kmsUrl">
          <a-input v-model="formData.kmsUrl" />
        </a-form-item>
        <a-form-item label="激活密钥" field="secretKey">
          <a-input v-model="formData.secretKey" disabled />
        </a-form-item>
        <a-form-item>
          <a-space size="small">
            <a-button html-type="submit" type="primary">生成脚本</a-button>
            <template v-if="activationScriptVisible">
              <a-button @click="downloadScript">下载脚本</a-button>
              <a-button @click="copyScript">复制脚本</a-button>
            </template>
          </a-space>
        </a-form-item>
        <a-form-item v-show="activationScriptVisible">
          <a-textarea v-model="activationScript" :auto-size="true" />
        </a-form-item>
      </a-form>
    </a-card>
    <a-card>
      <a-table
        :data="tableData"
        :columns="tableColumns"
        :row-key="tableRowKey"
        :row-selection="tableRowSelection"
        @selection-change="tableSelectionChange"
      />
    </a-card>
  </div>
</template>
