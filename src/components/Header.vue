<template>
  <a-layout-header>
    <div class="wrapper">
      <div class="logo">
        <img src="../assets/images/logo.svg">
      </div>
      <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px', float: 'right' }">
        <a-menu-item key="1" @click="openBlog">Blog</a-menu-item>
        <a-menu-item key="2" @click="openGithub">Github</a-menu-item>
      </a-menu>
    </div>
  </a-layout-header>
</template>

<script>
export default ({
  setup() {
    function openBlog() {
      window.open('https://www.ikxin.com')
    }
    function openGithub() {
      window.open('https://github.com/ikxin/kms-tools')
    }
    return {
      openBlog,
      openGithub
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