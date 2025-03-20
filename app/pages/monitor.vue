<script lang="ts" setup>
definePageMeta({
  title: 'pages.monitor.title',
})

const monitorData = useState<MonitorInfo[]>('monitorData')

function getColor(value: number): string {
  if (value < 0) return '#d9d9d9'
  if (value < 200) return '#52c41a'
  if (value < 500) return '#faad14'
  return '#f5222d'
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString()
}

function getChartOption(item: MonitorInfo): ECOption {
  const times = item.data.map(data => formatTime(data.time))
  const delays = item.data.map(data => ({
    value: data.delay,
    itemStyle: {
      color: getColor(data.delay),
    },
  }))

  return {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      containLabel: true,
      left: 0,
      right: 24,
      top: 8,
      bottom: 8,
    },
    xAxis: {
      type: 'category',
      data: times,
    },
    yAxis: {
      max: 999,
      min: 0,
      type: 'value',
      show: false,
    },
    series: [
      {
        name: '延迟',
        type: 'bar',
        data: delays,
        barWidth: '70%',
      },
    ],
  }
}
</script>

<template>
  <div class="flex w-full flex-col gap-4" ref="monitor">
    <template v-for="item in monitorData" :key="item.host">
      <ACard :title="item.host">
        <VChart
          :autoresize="true"
          :option="getChartOption(item)"
          class="h-32 w-full"
        />
      </ACard>
    </template>
  </div>
</template>

<style scoped>
:deep(.arco-card-size-medium .arco-card-body) {
  padding: 0px !important;
}
</style>
