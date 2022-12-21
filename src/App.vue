<script setup lang="ts">
import HeaderVue from '@/layouts/header.vue'
import FooterVue from '@/layouts/footer.vue'
</script>

<template>
  <div class="flex h-screen flex-col bg-[#f0f2f5]">
    <HeaderVue></HeaderVue>
    <a-layout-content class="grow">
      <RouterView></RouterView>
    </a-layout-content>
    <FooterVue></FooterVue>
  </div>
</template>
