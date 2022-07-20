<template>
  <a-layout-header>
    <div class="wrapper">
      <div class="logo">
        <img src="../assets/images/logo.png" />
      </div>
      <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px', float: 'right' }">
        <a-menu-item v-for="link in config.links" :key="link.id" @click="openLink(link.url)">
          {{ link.name }}
        </a-menu-item>
      </a-menu>
    </div>
  </a-layout-header>
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const config = reactive(window.Config)

    function openLink(url) {
      window.open(url)
    }

    return {
      config,
      openLink
    }
  }
}
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
