<script setup lang="ts">
import type { ValidatedError } from '@arco-design/web-vue'

definePageMeta({
  title: 'pages.check.title'
})

const { t } = useI18n()

const formData = ref({
  host: 'kms.8b5.cn',
  port: '1688',
  protocol: '6',
  edition: '1'
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
  visible: false
})

type KeyValueItem = {
  label: string
  value: string
}

type ParsedOutput = {
  requestItems: KeyValueItem[]
  responseItems: KeyValueItem[]
  rpcLines: string[]
  errors: string[]
  connectionLine: string
}

const requestParamLabelMap: Record<string, string> = {
  'Protocol version': 'pages.check.result.request-params.protocol-version',
  'Client is a virtual machine': 'pages.check.result.request-params.client-is-vm',
  'Licensing status': 'pages.check.result.request-params.licensing-status',
  'Remaining time (0 = forever)': 'pages.check.result.request-params.remaining-time',
  'Application ID': 'pages.check.result.request-params.application-id',
  'SKU ID (aka Activation ID)': 'pages.check.result.request-params.sku-id',
  'KMS ID (aka KMS counted ID)': 'pages.check.result.request-params.kms-id',
  'Client machine ID': 'pages.check.result.request-params.client-machine-id',
  'Previous client machine ID':
    'pages.check.result.request-params.previous-client-machine-id',
  'Client request timestamp (UTC)':
    'pages.check.result.request-params.client-request-timestamp-utc',
  'Workstation name': 'pages.check.result.request-params.workstation-name',
  'N count policy (minimum clients)':
    'pages.check.result.request-params.n-count-policy'
}

const responseParamLabelMap: Record<string, string> = {
  'Size of KMS Response': 'pages.check.result.response-params.kms-response-size',
  'KMS ePID': 'pages.check.result.response-params.kms-epid',
  'KMS HwId': 'pages.check.result.response-params.kms-hwid',
  'Client machine ID': 'pages.check.result.response-params.client-machine-id',
  'Client request timestamp (UTC)':
    'pages.check.result.response-params.client-request-timestamp-utc',
  'KMS host current active clients':
    'pages.check.result.response-params.kms-host-current-active-clients',
  'Renewal interval policy':
    'pages.check.result.response-params.renewal-interval-policy',
  'Activation interval policy':
    'pages.check.result.response-params.activation-interval-policy'
}

const parsedOutput = computed<ParsedOutput>(() => {
  const message = resultInfo.message
  if (!message) {
    return {
      requestItems: [],
      responseItems: [],
      rpcLines: [],
      errors: [],
      connectionLine: ''
    }
  }

  const lines = message
    .replace(/\r/g, '')
    .split('\n')
    .map(line => line.trimEnd())

  const requestStart = lines.findIndex(line =>
    line.includes('Request Parameters')
  )
  const responseStart = lines.findIndex(line =>
    line.includes('Response from KMS server')
  )
  const connectionStart = lines.findIndex(line =>
    line.trimStart().startsWith('Connecting to ')
  )
  const rpcStart = lines.findIndex(line => line.includes('Performing RPC bind'))

  const requestEnd = getSectionEnd(
    [connectionStart, rpcStart, responseStart],
    requestStart,
    lines.length
  )

  const requestItems = parseKnownKeyValueBlock(
    lines,
    requestStart >= 0 ? requestStart + 1 : -1,
    requestEnd,
    requestParamLabelMap
  )

  const responseItems = parseKnownKeyValueBlock(
    lines,
    responseStart >= 0 ? responseStart + 1 : -1,
    lines.length,
    responseParamLabelMap
  )

  const connectionLine =
    lines.find(line => line.trimStart().startsWith('Connecting to ')) || ''

  const rpcLines =
    rpcStart >= 0
      ? lines
          .slice(rpcStart, responseStart > rpcStart ? responseStart : lines.length)
          .filter(line => line.trim())
      : []

  const errorMatcher = /timed out|timeout|failed|error|refused|unreachable/i
  const errors = lines
    .filter(line => errorMatcher.test(line) && line.trim())
    .map(line => line.trim())

  if (resultInfo.type === 'error' && !errors.length) {
    const fallbackError = [...lines]
      .reverse()
      .find(
        line =>
          line.trim() &&
          !line.includes('Request Parameters') &&
          !line.includes('Response from KMS server') &&
          !/^=+$/.test(line.trim())
      )
    if (fallbackError) {
      errors.push(fallbackError.trim())
    }
  }

  return {
    requestItems,
    responseItems,
    rpcLines,
    errors,
    connectionLine
  }
})

const statusMeta = computed(() => {
  if (resultInfo.type === 'success') {
    return {
      title: t('pages.check.result.passed-title'),
      desc: t('pages.check.result.passed-desc'),
      color: 'green'
    }
  }

  if (resultInfo.type === 'error') {
    return {
      title: t('pages.check.result.failed-title'),
      desc: t('pages.check.result.failed-desc'),
      color: 'red'
    }
  }

  return {
    title: t('pages.check.result.default-title'),
    desc: t('pages.check.result.default-desc'),
    color: 'arcoblue'
  }
})

const rpcText = computed(() => parsedOutput.value.rpcLines.join('\n'))

const rawOutputText = computed(() => resultInfo.message.replace(/^\r?\n+/, ''))

function getRequestLabelI18n(label: string): string {
  const i18nKey = requestParamLabelMap[label]
  if (!i18nKey) {
    return label
  }
  return t(i18nKey)
}

function getResponseLabelI18n(label: string): string {
  const i18nKey = responseParamLabelMap[label]
  if (!i18nKey) {
    return label
  }
  return t(i18nKey)
}

function parseKeyValueBlock(
  lines: string[],
  start: number,
  end: number
): KeyValueItem[] {
  if (start < 0 || start >= end) {
    return []
  }

  const result: KeyValueItem[] = []
  for (let i = start; i < end; i++) {
    const current = lines[i]?.trim() || ''
    if (!current || /^=+$/.test(current)) {
      continue
    }

    const matched = current.match(/^([^:]+?)\s*:\s*(.+)$/)
    if (!matched) {
      continue
    }

    const rawLabel = matched[1]
    const rawValue = matched[2]
    if (!rawLabel || !rawValue) {
      continue
    }

    result.push({
      label: rawLabel.trim(),
      value: rawValue.trim()
    })
  }
  return result
}

function parseKnownKeyValueBlock(
  lines: string[],
  start: number,
  end: number,
  labelMap: Record<string, string>
): KeyValueItem[] {
  const allItems = parseKeyValueBlock(lines, start, end)
  return allItems.filter(item => !!labelMap[item.label])
}

function getSectionEnd(
  candidates: number[],
  start: number,
  fallbackEnd: number
): number {
  if (start < 0) {
    return fallbackEnd
  }

  const validEnds = candidates.filter(index => index > start)
  if (!validEnds.length) {
    return fallbackEnd
  }

  return Math.min(...validEnds)
}

const handleSubmit = async (data: {
  values: Record<string, any>
  errors: Record<string, ValidatedError> | undefined
}) => {
  if (data.errors === undefined) {
    resultInfo.loading = true
    try {
      const response = await request()('/api/check', {
        query: formData.value
      })
      resultInfo.message = response.content
      resultInfo.type = response.status ? 'success' : 'error'
      resultInfo.visible = true
      resultInfo.loading = false
    } catch (err) {
      resultInfo.message = String(err || t('pages.check.result.unknown-request-error'))
      resultInfo.type = 'error'
      resultInfo.visible = true
      resultInfo.loading = false
    }
  }
}
</script>

<template>
  <ACard class="h-full w-full">
    <template #title>
      <div class="flex items-center gap-2">
        <Icon name="icons:check" />
        <span>{{ t('title.kms-check') }}</span>
      </div>
    </template>
    <ASpin :loading="resultInfo.loading" dot class="w-full">
      <AForm :model="formData" @submit="handleSubmit" layout="vertical">
        <AFormItem :label="t('label.host')" field="host" required>
          <AInput v-model="formData.host"></AInput>
        </AFormItem>
        <AFormItem :label="t('label.port')" field="port" required>
          <AInput v-model="formData.port"></AInput>
        </AFormItem>
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
        <AFormItem :label="t('label.protocol')" field="protocol" required>
          <ASelect v-model="formData.protocol">
            <AOption value="6">V6 Protocol</AOption>
            <AOption value="5">V5 Protocol</AOption>
            <AOption value="4">V4 Protocol</AOption>
          </ASelect>
        </AFormItem>
        <AFormItem>
          <AButton html-type="submit" type="primary">
            {{ t('label.submit') }}
          </AButton>
        </AFormItem>
      </AForm>

      <div v-if="resultInfo.visible" class="mt-4 flex flex-col gap-4">
        <ACard
          :bordered="false"
          class="overflow-hidden border"
          :class="
            resultInfo.type === 'success'
              ? 'border-[rgb(var(--success-6))] bg-[rgb(var(--success-1))]'
              : resultInfo.type === 'error'
                ? 'border-[rgb(var(--danger-6))] bg-[rgb(var(--danger-1))]'
                : 'border-[rgb(var(--primary-6))] bg-[rgb(var(--primary-1))]'
          "
        >
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div class="flex min-w-0 flex-col gap-1">
              <div class="flex items-center gap-2">
                <Icon
                  :name="
                    resultInfo.type === 'success'
                      ? 'material-symbols:check-circle'
                      : resultInfo.type === 'error'
                        ? 'material-symbols:error'
                        : 'material-symbols:info'
                  "
                  class="text-lg"
                />
                <span class="text-base font-semibold text-[var(--color-text-1)]">
                  {{ statusMeta.title }}
                </span>
              </div>
              <span class="text-sm text-[var(--color-text-2)]">{{ statusMeta.desc }}</span>
            </div>
            <ATag bordered :color="statusMeta.color">{{ resultInfo.type.toUpperCase() }}</ATag>
          </div>

          <div
            v-if="parsedOutput.connectionLine"
            class="mt-3 rounded bg-[var(--color-fill-2)] px-3 py-2 font-mono text-xs text-[var(--color-text-2)]"
          >
            <span class="mr-1 text-[var(--color-text-3)]">{{
              t('pages.check.result.connection-title')
            }}:</span>
            {{ parsedOutput.connectionLine }}
          </div>
        </ACard>

        <AAlert
          v-if="parsedOutput.errors.length"
          type="error"
          :title="t('pages.check.result.errors-title')"
        >
          <div class="space-y-1">
            <div
              v-for="(line, index) in parsedOutput.errors"
              :key="`error-${index}`"
              class="break-all font-mono text-xs"
            >
              {{ line }}
            </div>
          </div>
        </AAlert>

        <div class="grid grid-cols-1 gap-4">
          <ACard :title="t('pages.check.result.request-title')" size="small">
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div
                v-for="item in parsedOutput.requestItems"
                :key="`request-${item.label}`"
                class="min-w-0 rounded bg-[var(--color-fill-1)] p-2"
              >
                <div class="mb-1 text-xs text-[var(--color-text-3)]">
                  {{ getRequestLabelI18n(item.label) }}
                </div>
                <div class="font-mono text-xs text-[var(--color-text-1)]">
                  {{ item.value }}
                </div>
              </div>
              <div
                v-if="!parsedOutput.requestItems.length"
                class="text-xs text-[var(--color-text-3)]"
              >
                {{ t('pages.check.result.request-empty') }}
              </div>
            </div>
          </ACard>

          <ACard :title="t('pages.check.result.response-title')" size="small">
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div
                v-for="item in parsedOutput.responseItems"
                :key="`response-${item.label}`"
                class="min-w-0 rounded bg-[var(--color-fill-1)] p-2"
              >
                <div class="mb-1 text-xs text-[var(--color-text-3)]">
                  {{ getResponseLabelI18n(item.label) }}
                </div>
                <div class="font-mono text-xs text-[var(--color-text-1)]">
                  {{ item.value }}
                </div>
              </div>
              <div
                v-if="!parsedOutput.responseItems.length"
                class="text-xs text-[var(--color-text-3)]"
              >
                {{ t('pages.check.result.response-empty') }}
              </div>
            </div>
          </ACard>
        </div>

        <ACard
          v-if="parsedOutput.rpcLines.length"
          :title="t('pages.check.result.rpc-title')"
          size="small"
        >
          <pre
            class="max-h-72 overflow-auto whitespace-pre rounded bg-[var(--color-fill-1)] p-3 font-mono text-xs leading-5 text-[var(--color-text-2)]"
          >{{ rpcText }}</pre>
        </ACard>

        <ACollapse>
          <ACollapseItem
            key="raw-output"
            :header="t('pages.check.result.raw-title')"
            class="overflow-hidden [&_.arco-collapse-item-content]:bg-[var(--color-bg-2)] [&_.arco-collapse-item-content]:px-4 [&_.arco-collapse-item-content]:py-3"
          >
            <pre class="max-h-72 overflow-auto whitespace-pre rounded bg-[var(--color-fill-1)] p-3 font-mono text-xs leading-5 text-[var(--color-text-2)]">{{ rawOutputText }}</pre>
          </ACollapseItem>
        </ACollapse>
      </div>
    </ASpin>
  </ACard>
</template>
