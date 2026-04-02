<script lang="ts" setup>
definePageMeta({
  title: 'pages.monitor.title'
})

const monitorData = useState<MonitorInfo[]>('monitorData')
const { t, locale } = useI18n()

const timeLocale = computed(() => {
  if (locale.value === 'zh-tw') return 'zh-TW'
  if (locale.value.startsWith('zh')) return 'zh-CN'
  return 'en-US'
})

function getColor(delay: number, status: boolean): string {
  if (!status) return '#f5222d'
  if (delay < 500) return '#52c41a'
  if (delay < 999) return '#f7ba1e'
  return '#fa8c16'
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(timeLocale.value)
}

function getAverageDelay(item: MonitorInfo): number {
  if (!item.data.length) return 0
  const totalDelay = item.data.reduce((sum, data) => sum + data.delay, 0)
  return Math.round(totalDelay / item.data.length)
}

function getSuccessRate(item: MonitorInfo): number {
  if (!item.total) return 0
  return Number(((item.success / item.total) * 100).toFixed(1))
}

function getDelayTagColor(item: MonitorInfo): 'green' | 'orange' | 'red' {
  const avgDelay = getAverageDelay(item)
  if (avgDelay < 500) return 'green'
  if (avgDelay < 999) return 'orange'
  return 'red'
}

function getSuccessRateTagColor(item: MonitorInfo): 'green' | 'orange' | 'red' {
  const successRate = getSuccessRate(item)
  if (successRate > 90) return 'green'
  if (successRate < 60) return 'red'
  return 'orange'
}

function getChartOption(item: MonitorInfo): ECOption {
  const times = item.data.map(data => formatTime(data.time))
  const delays = item.data.map(data => ({
    value: data.delay,
    itemStyle: {
      color: getColor(data.delay, data.status)
    }
  }))

  const maxDelay = item.data.reduce((max, data) => Math.max(max, data.delay), 0)
  const yAxisMax = Math.max(1200, Math.ceil(maxDelay / 100) * 100)

  return {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      containLabel: true,
      left: 0,
      right: 24,
      top: 8,
      bottom: 8
    },
    xAxis: {
      type: 'category',
      data: times
    },
    yAxis: {
      max: yAxisMax,
      min: 0,
      type: 'value',
      show: false
    },
    series: [
      {
        name: t('label.delay'),
        type: 'bar',
        data: delays,
        barWidth: '70%'
      }
    ]
  }
}
</script>

<template>
  <div class="flex w-full flex-col gap-4" ref="monitor">
    <template v-for="item in monitorData" :key="item.host">
      <ACard
        :title="item.host"
        class="[&_.arco-card-body]:!p-0 [&_.arco-card-header]:items-center"
      >
        <template #extra>
          <div
            class="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap"
          >
            <ATag bordered :color="getDelayTagColor(item)"
              >{{ getAverageDelay(item) }}ms</ATag
            >
            <ATag bordered :color="getSuccessRateTagColor(item)"
              >{{ getSuccessRate(item).toFixed(1) }}%</ATag
            >
          </div>
        </template>
        <VChart
          :autoresize="true"
          :option="getChartOption(item)"
          class="h-32 w-full"
        />
      </ACard>
    </template>
  </div>
</template>
