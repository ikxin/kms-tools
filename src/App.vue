<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />
  <router-view />
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
</style>