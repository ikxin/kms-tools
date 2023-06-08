<script setup lang="ts">
import CustomFooter from '@/layouts/custom-footer.vue'
import CustomHeader from '@/layouts/custom-header.vue'
</script>

<template>
  <CustomHeader></CustomHeader>
  <ALayout class="grow mx-auto w-256 max-w-full">
    <slot />
  </ALayout>
  <CustomFooter></CustomFooter>
</template>

<style>
#app {
  @apply flex flex-col gap-4 min-h-screen bg-[--color-neutral-2];
}
</style>
