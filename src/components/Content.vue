<template>
  <a-layout-content>
    <div class="content">
      <a-card title="KMS激活Windows一键脚本">
        <template #extra><a href="#">more</a></template>
        <p>1、激活步骤：根据自身系统下载激活脚本，再右键使用管理员运行该脚本即可。</p>
        <p>2、不知道系统版本的，使用Win+R，输入cmd并运行，然后在命令窗口输入slmgr/dlv查看版本。</p>
        <p>3、使用KMS激活系统后，有效期为180天。</p>
        <p>4、系统每7天会连接一次KMS服务器，获取最新的授权，然后激活有效期会重置为180天。</p>
        <p>5、只要KMS激活服务器不挂，激活状态会一直自动续命，无需人工再次干预。</p>
        <p>6、如果激活失败可先尝试清除后激活，<a href="https://kms.ikxin.com/kms.php?clean=1">点击下载清除脚本</a>。</p>
      </a-card>

      <a-card>
        <a-form>
          <a-form-item label="系统类型" name="select">
            <a-select v-model:value="formState.select" :allowClear="true" :dropdownMatchSelectWidth="380"
              placeholder="请选择系统类型">
              <a-select-option v-for="(item, index) in windowsData" :key="index" :value="index">
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
            <a-button :style="{ marginRight: '20px' }">生成脚本</a-button>
            <a-button type="primary">下载脚本</a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <a-card>
        <a-table :dataSource="listState.dataSource" :columns="listState.columns"
          :rowSelection="listState.rowSelection" />
      </a-card>
    </div>
  </a-layout-content>
</template>

<script>
import { reactive, watch } from 'vue'

export default {
  setup() {
    const windowsData = reactive(window.Data.windows)

    const formState = reactive({
      select: undefined,
      key: '',
      server: 'kms.v0v.bid'
    })

    const listState = reactive({
      dataSource: [],
      columns: [
        {
          title: '系统版本',
          dataIndex: 'release',
        },
        {
          title: '密钥',
          dataIndex: 'key',
        }
      ],
      rowSelection: {
        type: 'radio',
        onChange: (selectedRowKeys) => {
          formState.key = selectedRowKeys
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

    return {
      windowsData,
      formState,
      listState
    }
  }
}
</script>

<style lang="less" scoped>
.ant-layout-content {
  background-color: #f0f2f5;
}

.ant-card {
  margin-bottom: 20px;
}

.content {
  width: 1080px;
  max-width: 100%;
  min-height: calc(100vh - 134px);
  margin: 0 auto;
  padding: 20px 0;
}
</style>