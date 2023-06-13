<script setup lang="ts">
import README from '../../README.md'
</script>

<template>
  <ACard>
    <README></README>
  </ACard>
</template>

<style lang="less" scoped>
.markdown-body {
  padding: 16px;

  :deep(a) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1px 4px;
    color: rgb(var(--link-6));
    font-size: 14px;
    line-height: 1.5715;
    text-decoration: none;
    background-color: transparent;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition: all 0.1s cubic-bezier(0, 0, 1, 1);

    &:hover {
      color: rgb(var(--link-6));
      background-color: var(--color-fill-2);
    }
  }

  :deep(img) {
    max-width: 100%;
  }

  :deep(pre) {
    padding: 16px;
    overflow: auto;
  }
}
</style>
