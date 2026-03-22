<script lang="ts" setup>
import { motion } from 'motion-v'

const { gvlksData, title, generateScript } = defineProps<{
  gvlksData: GvlksData[]
  title: string
  generateScript: (formData: ActivateFormData) => string
}>()

const { t, locale } = useI18n()

const { hidden, hoverLift, press, viewport, visible } = useMotionPresets()

const monitorData = useState<MonitorInfo[]>('monitorData')

const rankVal = ref(1)

const formData = ref<ActivateFormData>({
  edition: gvlksData[0]?.edition[0]?.[rankVal.value] || '',
  arch: 'x64',
  host: monitorData.value?.[0]?.host || '',
  license: '',
})

watch(
  () => formData.value.edition,
  () => {
    for (const item of gvlksData) {
      const result = item.edition.find(_ => {
        return _[rankVal.value] === formData.value.edition
      })
      if (result) {
        formData.value.license = result[0]!
        break
      }
    }
  },
  { immediate: true }
)

watch(
  () => locale.value,
  val => {
    if (val === 'zh-cn') {
      rankVal.value = 2
    } else {
      rankVal.value = 1
    }
    formData.value.edition = gvlksData?.[0]?.edition?.[0]?.[rankVal.value]!
  },
  { immediate: true }
)

watch(monitorData, val => {
  formData.value.host = val?.[0]?.host || ''
})

const content = computed(() => {
  return generateScript(formData.value)
})

const file = computed(() => {
  return new File([content.value], 'kms.bat', { type: 'application/txt' })
})

const fileUrl = useObjectUrl(file)

const { copy, copied } = useClipboard({
  legacy: true,
  source: content,
})
</script>

<template>
  <motion.div class="flex flex-col gap-4" :initial="hidden(22, 0.98)" :animate="visible(0.04)">
    <motion.div
      :initial="hidden(24, 0.98)"
      :whileInView="visible()"
      :inViewOptions="viewport"
      :whileHover="hoverLift(6, 1.005)"
    >
      <ACard class="!bg-transparent relative overflow-hidden">
        <div
          class="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-[rgb(var(--primary-6))]/12 blur-3xl"
        />
      <template #title>
        <motion.div
          class="flex items-center gap-2"
          :initial="hidden(12)"
          :whileInView="visible()"
          :inViewOptions="viewport"
        >
          <i :class="`i-icons:${title.toLowerCase().replace(/ /g, '-')}`" />
          <span>{{ title }}</span>
        </motion.div>
      </template>
      <AForm :model="formData" layout="vertical">
        <motion.div :initial="hidden(16)" :whileInView="visible(0.04)" :inViewOptions="viewport">
          <AFormItem :label="t('label.edition')" field="edition" required>
          <ASelect v-model="formData.edition">
            <template v-for="item in gvlksData" :key="item.version">
              <AOptgroup :label="item.version">
                <template
                  v-for="edition in item.edition"
                  :key="edition[rankVal]"
                >
                  <AOption :label="edition[rankVal]" />
                </template>
              </AOptgroup>
            </template>
          </ASelect>
          </AFormItem>
        </motion.div>
        <motion.div
          v-if="title.toLowerCase() === 'office'"
          :initial="hidden(16)"
          :whileInView="visible(0.08)"
          :inViewOptions="viewport"
        >
          <AFormItem field="arch" :label="t('label.arch')" required>
            <ARadioGroup v-model="formData.arch" type="button">
              <ARadio value="x64">{{ t('label.x64') }}</ARadio>
              <ARadio value="x86">{{ t('label.x86') }}</ARadio>
            </ARadioGroup>
          </AFormItem>
        </motion.div>
        <motion.div :initial="hidden(16)" :whileInView="visible(0.12)" :inViewOptions="viewport">
          <AFormItem :label="t('label.host')" field="host" required>
          <ASelect v-model="formData.host">
            <template v-for="item in monitorData" :key="item.host">
              <AOption
                :value="item.host"
                :label="item.host"
                class="[&>*]:w-full"
              >
                <div class="flex gap-2 items-center">
                  <div class="flex-1">{{ item.host }}</div>
                  <ATag
                    :color="getRateColor(item.success / item.total)"
                    size="small"
                  >
                    {{ `${((item.success / item.total) * 100).toFixed(2)} %` }}
                  </ATag>
                  <ATag :color="getDelayColor(item.delay)" size="small">
                    {{ `${item.delay.toFixed(2)} ms` }}
                  </ATag>
                </div>
              </AOption>
            </template>
          </ASelect>
          </AFormItem>
        </motion.div>
        <motion.div :initial="hidden(16)" :whileInView="visible(0.16)" :inViewOptions="viewport">
          <AFormItem :label="t('label.license')" field="license" required>
            <AInput v-model="formData.license" disabled />
          </AFormItem>
        </motion.div>
        <motion.div :initial="hidden(16)" :whileInView="visible(0.2)" :inViewOptions="viewport" layout>
          <AFormItem :label="t('label.script')" required>
            <ClientOnly fallback-tag="textarea">
              <ATextarea v-model="content" auto-size />
              <template #fallback>
                <ATextarea auto-size />
              </template>
            </ClientOnly>
          </AFormItem>
        </motion.div>
        <motion.div :initial="hidden(16)" :whileInView="visible(0.24)" :inViewOptions="viewport" layout>
          <AFormItem>
            <ASpace size="small">
              <ClientOnly fallback-tag="a">
                <a :href="fileUrl" :download="file.name">
                  <motion.div :whileHover="hoverLift(4, 1.03)" :whilePress="press">
                    <AButton type="primary">
                      {{ t('label.download') }}
                    </AButton>
                  </motion.div>
                </a>
              </ClientOnly>
              <motion.div :whileHover="hoverLift(4, 1.03)" :whilePress="press" layout>
                <AButton
                  type="secondary"
                  :status="copied ? 'success' : 'normal'"
                  @click="copy()"
                >
                  {{ copied ? t('label.copy-success') : t('label.copy') }}
                </AButton>
              </motion.div>
            </ASpace>
          </AFormItem>
        </motion.div>
      </AForm>
      </ACard>
    </motion.div>
  </motion.div>
</template>
