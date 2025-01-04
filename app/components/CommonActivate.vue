<script lang="ts" setup>
const { gvlksData, title, generateScript } = defineProps<{
  gvlksData: GvlksData[]
  title: string
  generateScript: (formData: ActivateFormData) => string
}>()

const { t, locale } = useI18n()

const monitorData = ref<MonitorInfo[]>()

onMounted(async () => {
  const data = await request()<MonitorInfo[]>('/api/monitor')
  monitorData.value = data
})

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
  <div class="flex flex-col gap-4">
    <ACard>
      <template #title>
        <div class="flex items-center gap-2">
          <i :class="`i-icons:${title.toLowerCase().replace(/ /g, '-')}`" />
          <span>{{ title }}</span>
        </div>
      </template>
      <AForm :model="formData" layout="vertical">
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
        <AFormItem
          v-if="title.toLowerCase() === 'office'"
          field="arch"
          :label="t('label.arch')"
          required
        >
          <ARadioGroup v-model="formData.arch" type="button">
            <ARadio value="x64">{{ t('label.x64') }}</ARadio>
            <ARadio value="x86">{{ t('label.x86') }}</ARadio>
          </ARadioGroup>
        </AFormItem>
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
        <AFormItem :label="t('label.license')" field="license" required>
          <AInput v-model="formData.license" disabled />
        </AFormItem>
        <AFormItem :label="t('label.script')" required>
          <ClientOnly fallback-tag="textarea">
            <ATextarea v-model="content" auto-size />
            <template #fallback>
              <ATextarea auto-size />
            </template>
          </ClientOnly>
        </AFormItem>
        <AFormItem>
          <ASpace size="small">
            <ClientOnly fallback-tag="a">
              <a :href="fileUrl" :download="file.name">
                <AButton type="primary">
                  {{ t('label.download') }}
                </AButton>
              </a>
            </ClientOnly>
            <AButton
              type="secondary"
              :status="copied ? 'success' : 'normal'"
              @click="copy()"
            >
              {{ copied ? t('label.copy-success') : t('label.copy') }}
            </AButton>
          </ASpace>
        </AFormItem>
      </AForm>
    </ACard>
  </div>
</template>
