<script setup lang="ts">
import windowsData from '@/data/windows.json'
import { FieldRule, TableColumnData, TableRowSelection } from '@arco-design/web-vue'
import { computed, reactive, Ref, ref, watch } from 'vue'
// import { useScriptDownload, useScriptCopy } from '@/hooks/script'

// 生成脚本参数
const params = reactive({
  systemType: undefined,
  systemVersion: {
    id: null,
    name: null,
    key: null,
  },
  kmsServer: 'kms.moeclub.org',
  activationScript: {
    visible: false,
    content: null,
  },
})

// 计算激活脚本的内容
params.activationScript.content = computed(() => {
  return `@echo off\r\nslmgr /skms ${params.kmsServer}\r\nslmgr /ipk ${params.systemVersion.key}\r\nslmgr /ato\r\nslmgr /xpr`
})

const listState = reactive({
  dataSource: [],
  columns: [
    { title: '系统版本', dataIndex: 'release' },
    { title: '密钥', dataIndex: 'key' },
  ],
  rowSelection: {
    type: 'radio',
    onChange: (_, selectedRows) => {
      params.systemVersion.key = selectedRows[0].key
    },
  },
})

watch(
  () => params.systemType,
  () => {
    if (params.systemType === undefined) {
      listState.dataSource = []
    } else {
      listState.dataSource = windowsData[params.systemType].item
    }
  },
  { immediate: true }
)

// function generateScript() {
//   if (params.systemVersion.key && params.kmsServer) {
//     params.activationScript.visible = true
//   } else {
//     Message.error('请填写完整内容')
//   }
// }

// function downloadScript() {
//   if (params.systemVersion.key && params.kmsServer) {
//     useScriptDownload(params.activationScript.content, 'kms.bat')
//   } else {
//     Message.error('请填写完整内容')
//   }
// }

// function downloadCleanScript() {
//   const cleanScript = `@echo off\r\nslmgr /upk\r\nslmgr /ckms\r\nslmgr /rearm`
//   useScriptDownload(cleanScript, 'clean.bat')
// }

// function copyScript() {
//   if (params.systemVersion.key && params.kmsServer) {
//     useScriptCopy(params.activationScript.content)
//   } else {
//     Message.error('请填写完整内容')
//   }
// }

const formData = reactive({
  checkedType: '',
  kmsUrl: 'kms.moeclub.org',
  secretKey: '',
})

const formRules: Record<string, FieldRule | FieldRule[]> = {
  checkedType: {
    required: true,
    message: '请选择对应的系统类型',
  },
  kmsUrl: {
    required: true,
    message: '请选择 KMS 服务器',
  },
  secretKey: {
    required: true,
    message: '请在下方选择系统版本',
  },
}

const activationScript = computed(() => {
  return `@echo off\r\nslmgr /skms ${formData.kmsUrl}\r\nslmgr /ipk ${formData.secretKey}\r\nslmgr /ato\r\nslmgr /xpr`
})

const activationScriptVisible: Ref<boolean> = ref(false)

const handleSubmit = (data) => {
  if (data.errors === undefined) {
    activationScriptVisible.value = true
  }
}

const tableData = ref([])

const tableColumns: Array<TableColumnData> = [
  { title: '系统版本', dataIndex: 'release' },
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
  () => formData.checkedType,
  () => {
    windowsData.forEach((item) => {
      if (formData.checkedType === item.version) {
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
        <a-form-item label="系统类型" field="checkedType">
          <a-select v-model:model-value="formData.checkedType" placeholder="请选择系统类型">
            <template v-for="item in windowsData" :key="item.version">
              <a-option>{{ item.version }}</a-option>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="KMS服务器" field="kmsUrl">
          <a-input v-model:model-value="formData.kmsUrl" />
        </a-form-item>
        <a-form-item label="激活密钥" field="secretKey">
          <a-input v-model:model-value="formData.secretKey" disabled />
        </a-form-item>
        <a-form-item>
          <a-space size="small">
            <a-button html-type="submit" type="primary">生成脚本</a-button>
          </a-space>
        </a-form-item>
        <a-form-item v-show="activationScriptVisible">
          <a-textarea v-model:model-value="activationScript" :auto-size="true" />
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
