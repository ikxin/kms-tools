<script setup lang="ts">
import { useMonitorStore } from '@/store/monitor'
import * as echarts from 'echarts'

function getVirtualData(year) {
  const date = +echarts.time.parse(year + '-01-01')
  const end = +echarts.time.parse(+year + 1 + '-01-01')
  const dayTime = 3600 * 24 * 1000
  const data = []
  for (let time = date; time < end; time += dayTime) {
    data.push([echarts.time.format(time, '{yyyy}-{MM}-{dd}', false), Math.floor(Math.random() * 10000)])
  }
  return data
}

const columns = [
  {
    dataIndex: 'friendly_name',
    title: 'Domain',
    width: 160,
  },
  {
    dataIndex: 'custom_uptime_ranges',
    title: 'Uptime Ranges',
    render({ record }) {
      return h('div', { id: record.id, class: 'h-52' })
    },
  },
]

const monitorStore = useMonitorStore()

onMounted(() => {
  monitorStore.monitors.forEach(item => {
    var chartDom = document.getElementById(item.id)
    var myChart = echarts.init(chartDom)
    let option = {
      tooltip: {},
      visualMap: { min: 0, max: 10000, type: 'piecewise', orient: 'horizontal', left: 'center', top: 65 },
      calendar: {
        cellSize: ['auto', 13],
        range: '2016',
        itemStyle: { borderWidth: 0.5 },
        yearLabel: { show: false },
      },
      series: { type: 'heatmap', coordinateSystem: 'calendar', data: getVirtualData('2016') },
    }
    option && myChart.setOption(option)
  })
})
</script>

<template>
  <ASpin :loading="monitorStore.loading" dot>
    <!-- <div class="flex flex-col gap-4">
      <template v-for="item in monitorStore.monitors" :key="item.id">
        <ACard :title="item.friendly_name">
          {{ item.custom_uptime_ranges }}
        </ACard>
      </template>
    </div> -->
    <ATable :columns="columns" :data="monitorStore.monitors"></ATable>
  </ASpin>
</template>
