<script setup lang="ts">
import { useMonitorStore } from '@/store/monitor'
import { TableColumnData } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import { Tag } from '@arco-design/web-vue'
import { delayColor, rateColor } from '@/utils/formatter'

const { t } = useI18n()

const columns = computed<TableColumnData[]>(() => {
  return [
    {
      dataIndex: 'host',
      title: t('label.host'),
      minWidth: 160,
      render({ record }) {
        return h('span', { class: 'select-auto', innerHTML: record.host })
      },
    },
    {
      dataIndex: 'port',
      title: t('label.port'),
      minWidth: 80,
    },
    {
      dataIndex: 'rate',
      title: t('label.rate'),
      minWidth: 100,
      align: 'center',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      render({ record }) {
        return h(Tag, {
          color: rateColor(record.rate),
          class: 'w-18 justify-center',
          size: 'small',
          innerHTML: `${(record.rate * 100).toFixed(2)} %`,
        })
      },
    },
    {
      dataIndex: 'delay',
      title: t('label.delay'),
      minWidth: 120,
      align: 'center',
      sortable: {
        sortDirections: ['ascend', 'descend'],
      },
      render({ record }) {
        return h(Tag, {
          color: delayColor(record.delay),
          class: 'w-18 justify-center',
          size: 'small',
          innerHTML: `${record.delay.toFixed(2)} ms`,
        })
      },
    },
    {
      dataIndex: 'total',
      title: t('label.total'),
      minWidth: 100,
      align: 'center',
    },
    {
      dataIndex: 'success',
      title: t('label.success-total'),
      minWidth: 100,
      align: 'center',
    },
    {
      dataIndex: 'fail',
      title: t('label.fail-total'),
      minWidth: 100,
      align: 'center',
    },
    {
      dataIndex: 'updatedAt',
      title: t('label.updated-at'),
      minWidth: 180,
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
