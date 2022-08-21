<template>
  <a-layout-header class="p-0">
    <div class="w-[1080px] max-w-full my-0 mx-auto">
      <div class="w-32 float-left text-center">
        <img class="h-9 inline-block" src="../assets/images/logo.png" />
      </div>
      <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px', float: 'right' }">
        <a-menu-item v-for="link in config.links" :key="link.id" @click="openLink(link.url)">
          {{ link.name }}
        </a-menu-item>
      </a-menu>
    </div>
  </a-layout-header>
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const config = reactive(window.Config)

    function openLink(url) {
      window.open(url)
    }

    return {
      config,
      openLink
    }
  }
}
</script>
