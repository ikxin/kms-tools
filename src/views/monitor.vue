<script setup lang="ts">
import { useMonitorStore } from '@/store/monitor'
import { TableColumnData } from '@arco-design/web-vue'
import dayjs from 'dayjs'

const { t } = useI18n()

const columns = computed<TableColumnData[]>(() => {
  return [
    {
      dataIndex: 'host',
      title: t('label.host'),
      minWidth: 160,
    },
    {
      dataIndex: 'port',
      title: t('label.port'),
      width: 80,
    },
    {
      dataIndex: 'rate',
      title: t('label.rate'),
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
      title: t('label.delay'),
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
      title: t('label.total'),
      width: 80,
      align: 'center',
    },
    {
      dataIndex: 'success',
      title: t('label.success-total'),
      width: 80,
      align: 'center',
    },
    {
      dataIndex: 'fail',
      title: t('label.fail-total'),
      width: 80,
      align: 'center',
    },
    {
      dataIndex: 'updatedAt',
      title: t('label.updated-at'),
      width: 170,
      render({ record }) {
        return dayjs(record.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      },
    },
  ]
})

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
