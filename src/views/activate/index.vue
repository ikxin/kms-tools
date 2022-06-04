<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu openKeys="sub1" mode="inline" style="height: 100%">
        <a-sub-menu key="sub1">
          <template #title>
            <icon-park type="system" theme="outline" />
            <span>系统类型</span>
          </template>
          <a-menu-item key="1">
            <icon-park type="windows" theme="outline" />
            <span>Windows</span>
          </a-menu-item>
          <a-menu-item key="2">
            <icon-park type="word" theme="outline" />
            <span>Office</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <router-view />
  </a-layout>
</template>

<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
</script>

<style lang="less" scoped>
.ant-layout.ant-layout-has-sider {
  margin-top: 20px;
}

.ant-layout-sider {
  margin-right: 20px;
}

:deep(.ant-menu-title-content) {
  display: flex;
  align-items: center;

  span {
    line-height: 0;
  }

  span:first-child {
    margin-right: 8px;
  }
}
</style>