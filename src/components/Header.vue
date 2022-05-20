<template>
  <a-layout-header>
    <div class="logo">
      <img src="../assets/images/logo.svg">
    </div>
    <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
      <a-menu-item key="1">nav 1</a-menu-item>
      <a-menu-item key="2">nav 2</a-menu-item>
      <a-menu-item key="3">nav 3</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    return {
      selectedKeys: ref(['1']),
    };
  },

});
</script>

<style lang="less">
.logo {
  float: left;
  width: 120px;
  text-align: center;

  img {
    height: 36px;
  }
}
</style>