<template>
  <CustomHeader />
  <ALayout class="grow mx-auto w-256 max-w-full gap-4">
    <RouterView />
  </ALayout>
  <CustomFooter />
</template>

<style>
#app {
  @apply flex flex-col gap-4 min-h-screen bg-[--color-neutral-2];
}
</style>
