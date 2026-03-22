<script lang="ts" setup>
import { motion } from 'motion-v'

const { t } = useI18n()

const { hidden, hoverLift, press, viewport, visible } = useMotionPresets()
</script>

<template>
  <ALayoutFooter class="bg-[--color-bg-2] px-4">
    <div
      class="mx-auto flex min-h-14 max-w-full flex-col items-center justify-center gap-1 py-3 text-center text-sm md:flex-row md:gap-0 md:py-0"
    >
      <ASpace wrap class="justify-center">
        <motion.div
          :initial="hidden(14)"
          :whileInView="visible()"
          :inViewOptions="viewport"
          :whileHover="hoverLift(3, 1.01)"
        >
          Copyright &copy; {{ new Date().getFullYear() }}
          <ALink target="_blank" href="https://github.com/ikxin/kms-tools">
            KMS Tools
          </ALink>
        </motion.div>
        <motion.div
          :initial="hidden(14)"
          :whileInView="visible(0.05)"
          :inViewOptions="viewport"
          :whileHover="hoverLift(3, 1.01)"
        >
          Running on
          <ALink target="_blank" href="https://www.asiayun.com/aff/TVXVRALM">
            AsiaYun
          </ALink>
        </motion.div>
        <motion.div
          :initial="hidden(14)"
          :whileInView="visible(0.1)"
          :inViewOptions="viewport"
          :whileHover="hoverLift(3, 1.01)"
          :whilePress="press"
        >
          Code with by
          <ALink target="_blank" href="https://blog.ikxin.com">
            {{ t('label.author') }}
          </ALink>
        </motion.div>
      </ASpace>
    </div>
  </ALayoutFooter>
</template>
