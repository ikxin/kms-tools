<template>
  <a-layout>
    <!-- 使用说明 -->
    <readmeVue>
      <template #explain>
        <p>1. 在桌面右键选择此电脑点击属性，查看当前电脑的系统版本</p>
        <p>2. 在下方表单中选择对应的系统版本，复制或下载激活脚本，使用管理员权限运行该脚本。</p>
        <p>3. 使用KMS服务器激活系统后，有效期为180天。</p>
        <p>4. 系统每7天会连接一次KMS服务器，获取最新的授权，然后激活有效期会重置为180天。</p>
        <p>5. 如果激活失败可先尝试清除后激活，点击下载<a @click="downloadCleanScript">清除脚本</a>。</p>
      </template>
    </readmeVue>

    <!-- 选择系统 -->
    <a-card>
      <a-form>
        <a-form-item label="系统类型" name="type">
          <a-select v-model:value="form.type" :allowClear="true" placeholder="请选择系统类型">
            <a-select-option v-for="item in officeData" :key="item.id" :value="item.id">
              {{ item.version }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="激活密钥" name="key">
          <a-input v-model:value="form.key" disabled />
        </a-form-item>
        <a-form-item label="KMS服务器" name="server">
          <a-input v-model:value="form.server" />
        </a-form-item>
        <a-form-item>
          <a-space size="middle">
            <a-button @click="generateScript">生成脚本</a-button>
            <a-button @click="downloadScript" type="primary">下载脚本</a-button>
            <a-button v-show="form.script.visible" @click="copyScript" type="primary">复制脚本</a-button>
          </a-space>
        </a-form-item>
        <a-form-item v-show="form.script.visible">
          <a-textarea v-model:value="form.script.value" :rows="5" />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 系统版本数据 -->
    <a-card>
      <a-table :dataSource="list.dataSource" :columns="list.columns" :rowSelection="list.rowSelection" rowKey="id" size="middle" />
    </a-card>
  </a-layout>
</template>

<script setup>
import readmeVue from './components/readme'
import officeData from '../../data/office.json'

import { message } from 'ant-design-vue'
import { reactive, watch } from 'vue'
import { useScriptDownload, useScriptCopy } from '../../hooks/script'

const form = reactive({
  type: undefined,
  key: '',
  server: '',
  script: {
    visible: false,
    value: ''
  }
})

const list = reactive({
  dataSource: [],
  columns: [
    {
      title: '系统版本',
      dataIndex: 'release',
      key: 'id'
    },
    {
      title: '密钥',
      dataIndex: 'key',
      key: 'id'
    }
  ],
  rowSelection: {
    type: 'radio',
    onChange: (_, selectedRows) => {
      form.key = selectedRows[0].key
    }
  }
})

watch(
  () => form.type,
  () => {
    if (form.type === undefined) {
      list.dataSource = []
    } else {
      list.dataSource = officeData[form.type].item
    }
  },
  {
    immediate: true
  }
)

function generateScript() {
  if (form.key && form.server) {
    form.script = `@echo off\r\nslmgr /skms ${form.server}\r\nslmgr /ipk ${form.key}\r\nslmgr /ato\r\nslmgr /xpr`
    form.visible = true
  } else {
    message.error('未选择系统版本')
  }
}

function downloadScript() {
  if (form.key && form.server) {
    form.script = `@echo off\r\nslmgr /skms ${form.server}\r\nslmgr /ipk ${form.key}\r\nslmgr /ato\r\nslmgr /xpr`
    useScriptDownload(form.script, 'kms.bat')
  } else {
    message.error('未选择系统版本')
  }
}

function downloadCleanScript() {
  const cleanScript = `@echo off\r\nslmgr /upk\r\nslmgr /ckms\r\nslmgr /rearm`
  useScriptDownload(cleanScript, 'clean.bat')
}

function copyScript() {
  if (form.key && form.server) {
    useScriptCopy(form.script)
  } else {
    message.error('未选择系统版本')
  }
}
</script>

<style lang="less" scoped>
.ant-card {
  margin-bottom: 20px;
}

.ant-card:last-child {
  margin-bottom: 0;
}
</style>
