<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />
  <a-layout-content>
    <router-view />
  </a-layout-content>
  <Footer />
</template>

<style lang="less">
#app {
  font-family: 'moonbridge';
  background-color: #f0f2f5;
}

@font-face {
  font-family: 'moonbridge';
  src: url(./assets/fonts/moonbridge.woff);
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.ant-layout-content {
  width: 1080px;
  max-width: 100%;
  min-height: calc(100vh - 134px) !important;
  margin: 0 auto;
  overflow: hidden;
}
</style>
