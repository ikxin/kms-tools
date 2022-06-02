<template>
  <a-layout>
    <!-- 使用说明 -->
    <a-card title="使用说明">
      <template #extra><a href="#">more</a></template>
      <p>1. 在桌面右键选择此电脑点击属性，查看当前电脑的系统版本</p>
      <p>2. 在下方表单中选择对应的系统版本，复制或下载激活脚本，使用管理员权限运行该脚本。</p>
      <p>3. 使用KMS服务器激活系统后，有效期为180天。</p>
      <p>4. 系统每7天会连接一次KMS服务器，获取最新的授权，然后激活有效期会重置为180天。</p>
      <p>5. 如果激活失败可先尝试清除后激活，点击下载<a @click="downloadCleanScript">清除脚本</a>。</p>
    </a-card>
    <!-- 选择系统 -->
    <a-card>
      <a-form>
        <a-form-item label="系统类型" name="select">
          <a-select v-model:value="formState.select" :allowClear="true" :dropdownMatchSelectWidth="380"
            placeholder="请选择系统类型">
            <a-select-option v-for="item in windowsData" :key="item.id" :value="item.id">
              {{ item.version }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="激活密钥" name="key">
          <a-input v-model:value="formState.key" disabled />
        </a-form-item>
        <a-form-item label="KMS服务器" name="server">
          <a-input v-model:value="formState.server" />
        </a-form-item>
        <a-form-item>
          <a-space size="middle">
            <a-button @click="generateScript">生成脚本</a-button>
            <a-button @click="downloadScript" type="primary">下载脚本</a-button>
            <a-button v-show="formState.visible" @click="copyScript" type="primary">复制脚本</a-button>
          </a-space>
        </a-form-item>
        <a-form-item v-show="formState.visible">
          <a-textarea v-model:value="formState.script" :rows="5" />
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 系统版本数据 -->
    <a-card>
      <a-table :dataSource="listState.dataSource" :columns="listState.columns" :rowSelection="listState.rowSelection"
        rowKey="id" size="middle" />
    </a-card>
  </a-layout>
</template>

<script>
import { message } from 'ant-design-vue'
import { reactive, watch } from 'vue'

export default {
  setup() {
    const windowsData = reactive(window.Data.windows)

    const formState = reactive({
      select: undefined,
      key: '',
      server: 'kms.moeclub.org',
      script: '',
      visible: false
    })

    const listState = reactive({
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
          formState.key = selectedRows[0].key
        }
      }
    })

    watch(() => formState.select, () => {
      if (formState.select === undefined) {
        listState.dataSource = []
      } else {
        listState.dataSource = windowsData[formState.select].item
      }
    }, {
      immediate: true
    })

    function generateScript() {
      if (formState.key && formState.server) {
        formState.script = `@echo off\r\nslmgr /skms ${formState.server}\r\nslmgr /ipk ${formState.key}\r\nslmgr /ato\r\nslmgr /xpr`
        formState.visible = true
      } else {
        message.error('未选择系统版本')
      }
    }

    function downloadScript() {
      if (formState.key && formState.server) {
        formState.script = `@echo off\r\nslmgr /skms ${formState.server}\r\nslmgr /ipk ${formState.key}\r\nslmgr /ato\r\nslmgr /xpr`
        const file = new File([formState.script], 'kms.bat', { type: 'application/txt' })
        downloadFile(file)
      } else {
        message.error('未选择系统版本')
      }
    }

    function downloadCleanScript() {
      const cleanScript = `@echo off\r\nslmgr /upk\r\nslmgr /ckms\r\nslmgr /rearm`
      const file = new File([cleanScript], 'clean.bat', { type: 'application/txt' })
      downloadFile(file)
    }

    function copyScript() {
      if (formState.key && formState.server) {
        navigator.clipboard.writeText(formState.script).then(() => {
          message.success('复制成功')
        }).catch((error) => {
          message.error(error)
        })
      } else {
        message.error('未选择系统版本')
      }
    }

    function downloadFile(file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    return {
      windowsData,
      formState,
      listState,
      generateScript,
      downloadScript,
      downloadCleanScript,
      copyScript
    }
  }
}
</script>

<style lang="less" scoped>
.ant-card {
  margin-bottom: 20px;
}
</style>