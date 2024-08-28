<script setup lang="ts">
import README_ZH from '../../README.md'
import README_EN from '../../README_EN.md'

const { locale } = useI18n()

const README = computed(() => {
  if (locale.value === 'zh-cn' || locale.value === 'zh-tw') {
    return README_ZH
  } else {
    return README_EN
  }
})
</script>

<template>
  <ACard>
    <README></README>
  </ACard>
</template>

<style lang="less">
.markdown-body {
  padding: 16px;
  user-select: text;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1px 2px;
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

  img {
    max-width: 100%;
  }

  pre {
    line-height: 1.5;
    padding: 16px;
    overflow: auto;
  }

  ul {
    padding-left: 16px;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  li {
    code {
      border-radius: 2px;
      padding: 2px 4px;
      background-color: var(--color-fill-3);
    }
  }

  p {
    line-height: 1.5;
  }
}
</style>
