<script lang="ts" setup>
import { useMonitorStore } from '@/store/monitor'

const props = defineProps<{
  editionData: EditionItem[]
  title: string
  generateScript: (formData: ActivateFormData) => string
}>()

const { t } = useI18n()

const { title, editionData } = props

const monitorStore = useMonitorStore()

const { monitors } = monitorStore

const formData = ref<ActivateFormData>({
  edition: editionData[0].edition[0][1],
  arch: 'x64',
  host: monitors[0].host,
  license: '',
})

watchEffect(() => {
  for (const item of editionData) {
    for (const [license, name] of item.edition) {
      if (name === formData.value.edition) {
        formData.value.license = license
      }
    }
  }
})

const content = computed(() => {
  return props.generateScript(formData.value)
})

const file = computed(() => {
  return new File([content.value], 'kms.bat', { type: 'application/txt' })
})

const fileUrl = useObjectUrl(file)

const { copy, copied } = useClipboard({
  source: content,
  legacy: true,
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
      <AForm :model="formData" auto-label-width>
        <AFormItem :label="t('label.edition')" field="edition" required>
          <ASelect v-model="formData.edition">
            <template v-for="item in editionData" :key="item.version">
              <AOptgroup :label="item.version">
                <template v-for="edition in item.edition" :key="edition[1]">
                  <AOption :label="edition[1]" />
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
            <template v-for="item in monitors" :key="item.id">
              <AOption :label="item.host" />
            </template>
          </ASelect>
        </AFormItem>
        <AFormItem :label="t('label.license')" field="license" required>
          <AInput v-model="formData.license" disabled />
        </AFormItem>
        <AFormItem :label="t('label.script')" required>
          <ATextarea v-model="content" auto-size />
        </AFormItem>
        <AFormItem>
          <ASpace size="small">
            <a :href="fileUrl" :download="file.name">
              <AButton type="primary">
                {{ t('label.download') }}
              </AButton>
            </a>
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
