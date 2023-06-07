<script setup lang="ts">
import CustomFooter from '../components/custom-footer.vue'
import CustomHeader from '../components/custom-header.vue'
</script>

<template>
  <CustomHeader></CustomHeader>
  <ALayout class="grow">
    <slot />
  </ALayout>
  <CustomFooter></CustomFooter>
</template>

<style>
#app {
  @apply flex flex-col gap-4 h-screen max-h-screen overflow-hidden bg-[--color-neutral-2];
}
</style>
