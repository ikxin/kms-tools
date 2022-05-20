<template>
  <a-layout-header>
    <div class="wrapper">
      <div class="logo">
        <img src="../assets/images/logo.svg">
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal"
        :style="{ lineHeight: '64px', float: 'right' }">
        <a-menu-item key="1">Blog</a-menu-item>
        <a-menu-item key="2">Github</a-menu-item>
      </a-menu>
    </div>

  </a-layout-header>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      selectedKeys: ref(['2']),
    };
  },
});
</script>

<style lang="less" scoped>
.ant-layout-header {
  padding: 0;
}

.wrapper {
  width: 1080px;
  max-width: 100%;
  margin: 0 auto;

  .logo {
    float: left;
    width: 120px;
    text-align: center;

    img {
      height: 36px;
    }
  }
}
</style>