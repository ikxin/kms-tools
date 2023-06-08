<script setup lang="ts">
import Sidebar from './component/sidebar.vue'
import windowsData from './data/windows'
import {
  FieldRule,
  TableColumnData,
  TableRowSelection,
} from '@arco-design/web-vue'
import { computed, reactive, Ref, ref, watch } from 'vue'
import { useScript } from '@/hooks/useScript'
import { onMounted } from 'vue'

const formData = reactive({
  checkedType: '',
  kmsUrl: 'kms.moeclub.org',
  secretKey: '',
})

const formRules: Record<string, FieldRule | FieldRule[]> = {
  checkedType: {
    required: true,
    message: '请选择系统类型',
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

let activationScript = ref('')

onMounted(() => {
  activationScript = computed(() => {
    return `@echo off\r\nslmgr /skms ${formData.kmsUrl}\r\nslmgr /ipk ${formData.secretKey}\r\nslmgr /ato\r\nslmgr /xpr`
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
  <Sidebar>
    <div class="flex flex-col gap-4">
      <ACard>
        <AForm
          :model="formData"
          :rules="formRules"
          @submit="handleSubmit"
          auto-label-width
        >
          <AFormItem label="系统类型" field="checkedType">
            <ASelect
              v-model="formData.checkedType"
              placeholder="请选择系统类型"
            >
              <template v-for="item in windowsData" :key="item.version">
                <AOption>{{ item.version }}</AOption>
              </template>
            </ASelect>
          </AFormItem>
          <AFormItem label="KMS 服务器" field="kmsUrl">
            <AInput v-model="formData.kmsUrl" />
          </AFormItem>
          <AFormItem label="激活密钥" field="secretKey">
            <AInput v-model="formData.secretKey" disabled />
          </AFormItem>
          <AFormItem>
            <ASpace size="small">
              <AButton html-type="submit" type="primary">创建脚本</AButton>
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
  </Sidebar>
</template>
