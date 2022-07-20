<template>
  <a-layout>
    <!-- 使用说明 -->
    <readmeVue>
      <template #explain>
        <p>1. 打开Word、Excel等软件查看当前Office套件的版本。</p>
        <p>2. 在下方表单中选择对应的软件版本，复制或下载激活脚本，使用管理员权限运行该脚本。</p>
        <p>3. 如果不确定自己的Office是32位还是64位，两种版本都试一下，不报错的就是对的。</p>
      </template>
    </readmeVue>

    <!-- 选择版本 -->
    <a-card>
      <a-form :labelCol="{ span: 3 }">
        <a-form-item label="Office版本" name="officeVersion">
          <a-select v-model:value="params.officeVersion" :allowClear="true" placeholder="请选择Office版本">
            <a-select-option v-for="item in officeData" :key="item.id" :value="item.id">
              {{ item.version }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="系统版本" name="systemVersion">
          <a-radio-group v-model:value="params.systemVersion">
            <a-radio-button :value="64">64位</a-radio-button>
            <a-radio-button :value="32">32位</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="激活密钥" name="softwareVersionKey">
          <a-input v-model:value="params.softwareVersion.key" disabled />
        </a-form-item>
        <a-form-item label="KMS服务器" name="kmsServer">
          <a-input v-model:value="params.kmsServer" />
        </a-form-item>
        <a-form-item>
          <a-space size="middle">
            <a-button @click="generateScript">生成脚本</a-button>
            <a-button @click="downloadScript" type="primary">下载脚本</a-button>
            <a-button v-show="params.activationScript.visible" @click="copyScript" type="primary">复制脚本</a-button>
          </a-space>
        </a-form-item>
        <a-form-item v-show="params.activationScript.visible">
          <a-textarea v-model:value="params.activationScript.content" :rows="5" />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 版本数据 -->
    <a-card>
      <a-table :dataSource="list.dataSource" :columns="list.columns" :rowSelection="list.rowSelection" rowKey="id" size="middle" />
    </a-card>
  </a-layout>
</template>

<script setup>
import readmeVue from './components/readme'
import officeData from '../../data/office.json'

import { message } from 'ant-design-vue'
import { computed, reactive, watch } from 'vue'
import { useScriptDownload, useScriptCopy } from '../../hooks/script'

// 生成脚本参数
const params = reactive({
  officeVersion: undefined,
  systemVersion: 64,
  softwareVersion: {
    id: null,
    name: null,
    key: null
  },
  kmsServer: 'kms.moeclub.org',
  activationScript: {
    visible: false,
    content: null
  }
})

// 计算激活脚本的内容
params.activationScript.content = computed(() => {
  let catalogue
  if (params.systemVersion === 64) {
    catalogue = 'cd C:\\Program Files\\Microsoft Office\\Office16'
  } else {
    catalogue = 'cd C:\\Program Files (x86)\\Microsoft Office\\Office16'
  }
  const fix = `cscript ospp.vbs /inpkey:${params.softwareVersion.key}`
  const activation = `cscript ospp.vbs /sethst:${params.kmsServer}\r\ncscript ospp.vbs /act`
  return `${catalogue}\r\n${fix}\r\n${activation}`
})

// 创建脚本
function generateScript() {
  if (params.softwareVersion.key && params.kmsServer) {
    params.activationScript.visible = true
  } else {
    message.error('请填写完整内容')
  }
}

// 下载脚本
function downloadScript() {
  if (params.softwareVersion.key && params.kmsServer) {
    useScriptDownload(params.activationScript.content, 'office.bat')
  } else {
    message.error('请填写完整内容')
  }
}

// 复制脚本
function copyScript() {
  if (params.softwareVersion.key && params.kmsServer) {
    useScriptCopy(params.activationScript.content)
  } else {
    message.error('请填写完整内容')
  }
}

// 列表属性
const list = reactive({
  dataSource: [],
  columns: [
    { title: '系统版本', dataIndex: 'release' },
    { title: '密钥', dataIndex: 'key' }
  ],
  rowSelection: {
    type: 'radio',
    onChange: (_, selectedRows) => {
      params.softwareVersion.key = selectedRows[0].key
    }
  }
})

watch(
  () => params.officeVersion,
  () => {
    if (params.officeVersion === undefined) {
      list.dataSource = []
    } else {
      list.dataSource = officeData[params.officeVersion].item
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.ant-card {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
