<script setup lang="ts">
import { useMonitorStore } from '@/store/monitor'

const monitorStore = useMonitorStore()
</script>

<template>
  <ASpin :loading="monitorStore.loading" dot>
    <div class="flex flex-col gap-4">
      <template v-for="item in monitorStore.monitors" :key="item.id">
        <ACard :title="item.friendly_name">
          {{ item.custom_uptime_ranges }}
        </ACard>
      </template>
    </div>
  </ASpin>
</template>
