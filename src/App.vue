<script setup lang="ts">
import CommonHeader from '@/layouts/CommonHeader.vue'
import CommonFooter from '@/layouts/CommonFooter.vue'
</script>

<template>
  <div class="flex h-full min-h-screen flex-col gap-4 bg-[#f0f2f5]">
    <CommonHeader></CommonHeader>
    <a-layout-content class="mx-auto w-container max-w-full grow">
      <RouterView></RouterView>
    </a-layout-content>
    <CommonFooter></CommonFooter>
  </div>
</template>
