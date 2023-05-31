<template>
  <h1>Welcome</h1>
  This page is:
  <ul>
    <li>Rendered to HTML.</li>
    <li>
      Interactive.
      <button type="button" @click="state.count++">
        Counter {{ state.count }}
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const state = reactive({ count: 0 })
</script>
