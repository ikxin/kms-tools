<script setup lang="ts">
import * as dayjs from 'dayjs'

const currentYear = ref(dayjs().year())
</script>

<template>
  <ALayoutFooter class="bg-[--color-bg-2] px-2">
    <div
      class="mx-auto flex h-14 w-256 max-w-full whitespace-nowrap"
      flex="~ items-center justify-center"
    >
      <ASpace>
        <div>
          Copyright &copy; {{ currentYear }}
          <ALink target="_blank" href="https://github.com/ikxin/kms-tools">
            KMS Tools
          </ALink>
        </div>
        <div>
          Code with by
          <ALink target="_blank" href="https://www.ikxin.com"> 一纸忘忧 </ALink>
        </div>
      </ASpace>
    </div>
  </ALayoutFooter>
</template>
