<script setup lang="ts">
import { System, Application, Windows as WindowsIcon, Word } from '@icon-park/vue-next'
import Windows from '@/pages/SoftwareActivation/Windows.vue'
import Office from '@/pages/SoftwareActivation/Office.vue'
import { type Component, Ref, shallowRef } from 'vue'

const checkedComponent: Ref<Component> = shallowRef(Windows)

const changeComponent = (component) => {
  checkedComponent.value = component
}
</script>

<template>
  <a-layout>
    <a-layout-sider>
      <a-menu :style="{ height: '100%' }" :default-open-keys="['0', '1']" :default-selected-keys="['0_0']">
        <a-sub-menu key="0">
          <template #icon><System /></template>
          <template #title>系统</template>
          <a-menu-item key="0_0" @click="changeComponent(Windows)">
            <template #icon><WindowsIcon /></template>
            Windows
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="1">
          <template #icon><Application /></template>
          <template #title>软件</template>
          <a-menu-item key="1_0" @click="changeComponent(Office)">
            <template #icon><Word /></template>
            Office
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content class="ml-4">
      <component :is="checkedComponent"></component>
    </a-layout-content>
  </a-layout>
</template>
