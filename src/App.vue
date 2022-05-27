<script setup>
import Header from './components/Header.vue'
import Content from './components/Content.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />
  <Content />
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