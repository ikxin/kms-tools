<script setup lang="ts">
import { useMonitorStore } from '@/store/monitor'
import dayjs from 'dayjs'
import * as echarts from 'echarts'

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
      return h('div', { id: record.id, class: 'h-36' })
    },
  },
]

const monitorStore = useMonitorStore()

onMounted(() => {
  monitorStore.monitors.forEach(item => {
    const ranges = Array.from({ length: 120 }, (_, num) => {
      return dayjs().subtract(num, 'day').format('YYYY-MM-DD')
    }).reverse()
    const uptime = item.custom_uptime_ranges.split('-')
    const customUptimeRanges = ranges.map((item, index) => [item, Number(uptime[index])])

    const echart = echarts.init(document.getElementById(item.id), null, { locale: 'EN' })

    echart.setOption({
      tooltip: {},
      visualMap: {
        align: 'left',
        min: 0,
        max: 100,
        type: 'piecewise',
        left: 'right',
        top: 'center',
        inRange: {
          color: ['#ebedf0', '#f44336', '#ffc107', '#41c464'],
          symbolSize: [0, 99, 100],
        },
      },
      calendar: {
        cellSize: [32, 16],
        itemStyle: { borderWidth: 0.5 },
        top: 'center',
        left: 20,
        range: [ranges.at(0), ranges.at(-1)],
        yearLabel: { show: false },
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: customUptimeRanges,
      },
    })
  })
})
</script>

<template>
  <ASpin :loading="monitorStore.loading" dot>
    <ATable :columns="columns" :data="monitorStore.monitors"></ATable>
  </ASpin>
</template>
