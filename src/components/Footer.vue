<template>
  <a-layout-footer style="text-align: center">
    <a-back-top />
    <span>Copyright &copy; 2022 <a target="_blank" href="https://github.com/ikxin/kms-tools">KMS Tools</a> | </span>
    <span>Code with by <a target="_blank" href="https://www.ikxin.com">一纸忘忧</a></span>
    <span v-if="beian">
      | <a target="_blank" href="http://beian.miit.gov.cn/">{{ beian }}</a></span
    >
  </a-layout-footer>
</template>

<script setup>
import { ref } from 'vue'
const beian = ref(window.Config.beian)
</script>
