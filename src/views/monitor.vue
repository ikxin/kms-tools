<script setup lang="ts">
import { useMonitorStore } from '@/store/monitor'
import { TableColumnData } from '@arco-design/web-vue'
import dayjs from 'dayjs'

const columns: TableColumnData[] = [
  {
    dataIndex: 'host',
    title: '服务器',
    minWidth: 160,
  },
  {
    dataIndex: 'port',
    title: '端口',
    width: 80,
  },
  {
    dataIndex: 'rate',
    title: '成功率',
    width: 100,
    align: 'center',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    render({ record }) {
      return `${(record.rate * 100).toFixed(2)} %`
    },
  },
  {
    dataIndex: 'delay',
    title: '平均延迟',
    width: 120,
    align: 'center',
    sortable: {
      sortDirections: ['ascend', 'descend'],
    },
    render({ record }) {
      return `${record.delay.toFixed(2)} ms`
    },
  },
  {
    dataIndex: 'total',
    title: '总请求',
    width: 80,
    align: 'center',
  },
  {
    dataIndex: 'success',
    title: '成功数',
    width: 80,
    align: 'center',
  },
  {
    dataIndex: 'fail',
    title: '失败数',
    width: 80,
    align: 'center',
  },
  {
    dataIndex: 'updatedAt',
    title: '更新时间',
    width: 170,
    render({ record }) {
      return dayjs(record.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    },
  },
]

const monitorStore = useMonitorStore()
</script>

<template>
  <ASpin :loading="false" dot>
    <ATable
      :columns="columns"
      :data="monitorStore.monitors"
      :pagination="false"
    ></ATable>
  </ASpin>
</template>
