<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="w-full rounded bg-[var(--color-bg-2)] p-8 shadow-lg">
    <div class="flex flex-row items-center py-8">
      <div class="ml-16 text-left">
        <h2
          class="mx-0 mb-6 w-fit bg-gradient-to-r from-[#e85349] to-[#f3bb4b] bg-clip-text text-7xl font-bold text-transparent"
        >
          KMS Tools
        </h2>
        <p class="mb-4 text-4xl font-bold text-gray-600">一站式 KMS 工具箱</p>
        <p class="mb-8 text-3xl text-gray-500">
          简单易用的 KMS 管理工具，支持激活 Windows、Office 等多种产品
        </p>
        <div class="flex gap-4">
          <NuxtLink :to="localePath('/activate/windows')">
            <AButton type="primary">开始使用</AButton>
          </NuxtLink>
          <NuxtLink to="https://github.com/ikxin/kms-tools" target="_blank">
            <AButton>Github</AButton>
          </NuxtLink>
        </div>
      </div>
      <div class="relative flex">
        <img
          src="/images/homepage-right.svg"
          alt="KMS Tools"
          class="h-auto min-w-[480px]"
        />
      </div>
    </div>
  </div>
</template>
