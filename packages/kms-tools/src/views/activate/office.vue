<script setup lang="ts">
import officeData from './data/office'
import {
  FieldRule,
  TableColumnData,
  TableRowSelection,
} from '@arco-design/web-vue'
import { computed, onMounted, reactive, Ref, ref, watch } from 'vue'
import { useScript } from '@/composables/useScript'

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

let activationScript = ref('')

onMounted(() => {
  activationScript = computed(() => {
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
    <ACard>
      <AForm
        :model="formData"
        :rules="formRules"
        @submit="handleSubmit"
        auto-label-width
      >
        <AFormItem label="Office 版本" field="officeVersion">
          <ASelect
            v-model="formData.officeVersion"
            placeholder="请选择系统类型"
          >
            <template v-for="item in officeData" :key="item.version">
              <AOption>{{ item.version }}</AOption>
            </template>
          </ASelect>
        </AFormItem>
        <AFormItem label="系统版本" field="systemVersion">
          <ARadioGroup
            v-model="formData.systemVersion"
            :options="systemVersionOptions"
          />
        </AFormItem>
        <AFormItem label="KMS 服务器" field="kmsUrl">
          <AInput v-model="formData.kmsUrl" />
        </AFormItem>
        <AFormItem label="激活密钥" field="secretKey">
          <AInput v-model="formData.secretKey" disabled />
        </AFormItem>
        <AFormItem>
          <ASpace size="small">
            <AButton html-type="submit" type="primary">生成脚本</AButton>
            <template v-if="activationScriptVisible">
              <AButton @click="downloadScript">下载脚本</AButton>
              <AButton @click="copyScript">复制脚本</AButton>
            </template>
          </ASpace>
        </AFormItem>
        <AFormItem v-show="activationScriptVisible">
          <ATextarea v-model="activationScript" :auto-size="true" />
        </AFormItem>
      </AForm>
    </ACard>
    <ACard>
      <ATable
        :data="tableData"
        :columns="tableColumns"
        :row-key="tableRowKey"
        :row-selection="tableRowSelection"
        @selection-change="tableSelectionChange"
      />
    </ACard>
  </div>
</template>
