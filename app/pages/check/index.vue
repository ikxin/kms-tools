<script setup lang="ts">
import type { ValidatedError } from '@arco-design/web-vue'
import { AnimatePresence, motion } from 'motion-v'

definePageMeta({
  title: 'pages.check.title',
})

const { t } = useI18n()

const { hidden, hoverLift, press, viewport, visible } = useMotionPresets()

const formData = ref({
  host: 'kms.8b5.cn',
  port: '1688',
  protocol: '6',
  edition: '1',
})

const resultInfo = reactive<{
  loading: boolean
  message: string
  type: 'normal' | 'error' | 'success' | 'warning' | 'info'
  visible: boolean
}>({
  loading: false,
  message: '',
  type: 'normal',
  visible: false,
})

const handleSubmit = async (data: {
  values: Record<string, any>
  errors: Record<string, ValidatedError> | undefined
}) => {
  if (data.errors === undefined) {
    resultInfo.loading = true
    try {
      const data = await request()('/api/check', {
        query: formData.value,
      })
      resultInfo.message = data.content
      resultInfo.type = data.status ? 'success' : 'error'
      resultInfo.visible = true
      resultInfo.loading = false
    } catch (err) {
      resultInfo.loading = false
    }
  }
}
</script>

<template>
  <motion.div
    class="w-full"
    :initial="hidden(22, 0.98)"
    :animate="visible(0.04)"
    :whileHover="hoverLift(6, 1.004)"
  >
    <ACard class="!bg-transparent h-full w-full overflow-hidden">
      <template #title>
        <motion.div
          class="flex items-center gap-2"
          :initial="hidden(12)"
          :whileInView="visible()"
          :inViewOptions="viewport"
        >
          <Icon name="icons:check" />
          <span>{{ t('title.kms-check') }}</span>
        </motion.div>
      </template>
      <ASpin :loading="resultInfo.loading" dot class="w-full">
        <AForm :model="formData" @submit="handleSubmit" layout="vertical">
          <motion.div :initial="hidden(16)" :whileInView="visible(0.04)" :inViewOptions="viewport">
            <AFormItem :label="t('label.host')" field="host" required>
              <AInput v-model="formData.host"></AInput>
            </AFormItem>
          </motion.div>
          <motion.div :initial="hidden(16)" :whileInView="visible(0.08)" :inViewOptions="viewport">
            <AFormItem :label="t('label.port')" field="port" required>
              <AInput v-model="formData.port"></AInput>
            </AFormItem>
          </motion.div>
          <motion.div :initial="hidden(16)" :whileInView="visible(0.12)" :inViewOptions="viewport">
            <AFormItem :label="t('label.edition')" field="edition" required>
              <ASelect v-model="formData.edition">
                <AOption
                  v-for="(value, key) in appItems"
                  :key="key"
                  :value="key"
                  :label="value"
                />
              </ASelect>
            </AFormItem>
          </motion.div>
          <motion.div :initial="hidden(16)" :whileInView="visible(0.16)" :inViewOptions="viewport">
            <AFormItem :label="t('label.protocol')" field="protocol" required>
              <ASelect v-model="formData.protocol">
                <AOption value="6">V6 Protocol</AOption>
                <AOption value="5">V5 Protocol</AOption>
                <AOption value="4">V4 Protocol</AOption>
              </ASelect>
            </AFormItem>
          </motion.div>
          <motion.div :initial="hidden(16)" :whileInView="visible(0.2)" :inViewOptions="viewport">
            <AFormItem>
              <motion.div :whileHover="hoverLift(4, 1.03)" :whilePress="press">
                <AButton html-type="submit" type="primary">
                  {{ t('label.submit') }}
                </AButton>
              </motion.div>
            </AFormItem>
          </motion.div>
        </AForm>

        <AnimatePresence>
          <motion.div
            v-if="resultInfo.visible"
            key="check-result"
            :initial="hidden(14, 0.98)"
            :animate="visible(0.04)"
            :exit="{ opacity: 0, y: -10, transition: { duration: 0.18 } }"
          >
            <AAlert
              :type="resultInfo.type"
              :title="resultInfo.type"
              class="whitespace-pre"
            >
              {{ resultInfo.message }}
            </AAlert>
          </motion.div>
        </AnimatePresence>
      </ASpin>
    </ACard>
  </motion.div>
</template>
