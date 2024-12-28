<script lang="ts" setup>
const { t } = useI18n()
</script>

<template>
  <ALayoutFooter class="bg-[--color-bg-2] px-2">
    <div
      class="mx-auto flex h-14 max-w-full whitespace-nowrap items-center justify-center"
    >
      <ASpace>
        <div>
          Copyright &copy; {{ new Date().getFullYear() }}
          <ALink target="_blank" href="https://github.com/ikxin/kms-tools">
            KMS Tools
          </ALink>
        </div>
        <div>
          Code with by
          <ALink target="_blank" href="https://www.ikxin.com">
            {{ t('label.author') }}
          </ALink>
        </div>
      </ASpace>
    </div>
  </ALayoutFooter>
</template>
