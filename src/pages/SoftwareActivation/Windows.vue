<script setup lang="ts">
import windowsData from '@/data/windows.json'

import { Message } from '@arco-design/web-vue'
import { computed, reactive, watch } from 'vue'
import { useScriptDownload, useScriptCopy } from '@/hooks/script'

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

function generateScript() {
  if (params.systemVersion.key && params.kmsServer) {
    params.activationScript.visible = true
  } else {
    Message.error('请填写完整内容')
  }
}

function downloadScript() {
  if (params.systemVersion.key && params.kmsServer) {
    useScriptDownload(params.activationScript.content, 'kms.bat')
  } else {
    Message.error('请填写完整内容')
  }
}

function downloadCleanScript() {
  const cleanScript = `@echo off\r\nslmgr /upk\r\nslmgr /ckms\r\nslmgr /rearm`
  useScriptDownload(cleanScript, 'clean.bat')
}

function copyScript() {
  if (params.systemVersion.key && params.kmsServer) {
    useScriptCopy(params.activationScript.content)
  } else {
    Message.error('请填写完整内容')
  }
}
</script>

<template>
  <a-layout>
    <!-- 选择版本 -->
    <a-card>
      <a-form :label-col-props="{ span: 3 }">
        <a-form-item label="系统类型" name="systemType">
          <a-select v-model:value="params.systemType" :allowClear="true" placeholder="请选择系统类型">
            <a-option v-for="item in windowsData" :key="item.id" :value="item.id">
              {{ item.version }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="激活密钥" name="softwareVersionKey">
          <a-input v-model:value="params.systemVersion.key" disabled />
        </a-form-item>
        <a-form-item label="KMS服务器" name="kmsServer">
          <a-input v-model:value="params.kmsServer" />
        </a-form-item>
        <a-form-item>
          <a-space size="middle">
            <a-button @click="generateScript">生成脚本</a-button>
            <a-button @click="downloadScript" class="bg-[#1890ff]" type="primary">下载脚本</a-button>
            <a-button v-show="params.activationScript.visible" @click="copyScript" class="bg-[#1890ff]" type="primary"
              >复制脚本</a-button
            >
          </a-space>
        </a-form-item>
        <a-form-item v-show="params.activationScript.visible">
          <a-textarea v-model:value="params.activationScript.content" :rows="5" />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 版本数据 -->
    <a-card>
      <a-table
        :dataSource="listState.dataSource"
        :columns="listState.columns"
        :rowSelection="listState.rowSelection"
        rowKey="id"
        size="middle"
      />
    </a-card>
  </a-layout>
</template>

<style lang="less" scoped>
.arco-card {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
