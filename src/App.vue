<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />
  <a-layout-content class="my-0 mx-auto !min-h-[calc(100vh-134px)] w-[1080px] max-w-full overflow-hidden">
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

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
