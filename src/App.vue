<script setup lang="ts">
import CommonHeader from '@/layouts/CommonHeader.vue'
import CommonFooter from '@/layouts/CommonFooter.vue'
</script>

<template>
  <div class="flex h-screen flex-col bg-[#f0f2f5]">
    <CommonHeader></CommonHeader>
    <a-layout-content class="grow">
      <RouterView></RouterView>
    </a-layout-content>
    <CommonFooter></CommonFooter>
  </div>
</template>
