<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <ALayoutFooter class="bg-[--color-bg-2] px-4">
    <div
      class="mx-auto flex min-h-14 max-w-full flex-col items-center justify-center gap-1 py-3 text-center text-sm md:flex-row md:gap-0 md:py-0"
    >
      <ASpace wrap class="justify-center">
        <div>
          Copyright &copy; {{ new Date().getFullYear() }}
          <ALink target="_blank" href="https://github.com/ikxin/kms-tools">
            KMS Tools
          </ALink>
        </div>
        <div>
          Running on
          <ALink target="_blank" href="https://www.asiayun.com/aff/TVXVRALM">
            AsiaYun
          </ALink>
        </div>
        <div>
          Code with by
          <ALink target="_blank" href="https://blog.ikxin.com">
            {{ t('label.author') }}
          </ALink>
        </div>
      </ASpace>
    </div>
  </ALayoutFooter>
</template>
