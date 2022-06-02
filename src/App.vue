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
}

@font-face {
  font-family: 'moonbridge';
  src: url(./assets/fonts/moonbridge.woff);
}

.ant-layout-content {
  background-color: #f0f2f5;
}
</style>