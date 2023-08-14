<script setup lang="ts">
import { useMonitorStore } from '@/store/monitor'

const monitorStore = useMonitorStore()
</script>

<template>
  <div class="flex flex-col gap-4">
    <template v-for="item in monitorStore.monitorData" :key="item.id">
      <ACard :title="item.friendly_name">
        {{ item.custom_uptime_ranges }}
      </ACard>
    </template>
  </div>
</template>
