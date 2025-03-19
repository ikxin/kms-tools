<script lang="ts" setup>
definePageMeta({
  title: 'pages.monitor.title',
})

const monitorData = useState<MonitorInfo[]>('monitorData')

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString()
}

function getChartOption(item: MonitorInfo) {
  const times = item.data.map(data => formatTime(data.time))
  const delays = item.data.map(data => data.delay)

  return {
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: times,
      axisLabel: {
        rotate: 45,
        formatter: (value: string) => value.slice(0, 8),
      },
    },
    yAxis: {
      type: 'value',
      name: '延迟 (ms)',
    },
    series: [
      {
        name: '延迟',
        type: 'line',
        smooth: true,
        data: delays,
        lineStyle: {
          width: 2,
          color: '#5470c6',
        },
        areaStyle: {
          color: 'rgba(84, 112, 198, 0.2)',
        },
      },
    ],
  }
}
</script>

<template>
  <ACard class="w-full p-4">
    <template v-for="item in monitorData" :key="item.host">
      <div
        class="mb-6 flex flex-col items-start rounded-lg bg-gray-50 p-4 shadow lg:flex-row"
      >
        <div class="mb-4 w-full lg:mb-0 lg:w-1/4 lg:pr-4">
          <h2 class="text-lg font-semibold text-gray-700">{{ item.host }}</h2>
          <p class="text-sm text-gray-500">监控点数：{{ item.data.length }}</p>
        </div>
        <div class="w-full lg:w-3/4">
          <VChart
            :option="getChartOption(item)"
            style="width: 100%; height: 200px"
          />
        </div>
      </div>
    </template>
  </ACard>
</template>
