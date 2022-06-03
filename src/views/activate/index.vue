<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff"></a-layout-sider>
    <router-view />
  </a-layout>
</template>

<script setup>

</script>

<style lang="less" scoped>
.ant-layout.ant-layout-has-sider {
  margin-top: 20px;
}

.ant-layout-sider {
  margin-right: 20px;
}
</style>