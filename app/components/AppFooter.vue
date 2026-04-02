<script lang="ts" setup>
const { t } = useI18n()

const currentYear = new Date().getFullYear()
</script>

<template>
  <ALayoutFooter class="mt-8 bg-[--color-bg-2] px-4 py-6">
    <div class="mx-auto w-[72rem] max-w-full p-2">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div class="space-y-4">
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-[--color-text-1] md:text-2xl">
              KMS Tools
            </h3>
            <p class="max-w-2xl text-sm leading-6 text-[--color-text-3]">
              {{ t('footer.description') }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="mt-6 flex flex-col gap-2 pt-4 text-xs text-[--color-text-3] sm:flex-row sm:items-center sm:justify-between"
      >
        <p>
          Copyright &copy; {{ currentYear }}
          <ALink target="_blank" href="https://github.com/ikxin/kms-tools">
            KMS Tools
          </ALink>
        </p>
        <p>
          Running on
          <ALink target="_blank" href="https://www.rainyun.com/mm_?s=kms-tools">
            RainYun
          </ALink>
          · Code by
          <ALink target="_blank" href="https://blog.ikxin.com">
            {{ t('label.author') }}
          </ALink>
        </p>
      </div>
    </div>
  </ALayoutFooter>
</template>
