<template>
  <a-layout>
    <a-layout-sider style="background: #fff" breakpoint="lg" :collapsed-width="0">
      <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" style="height: 100%">
        <a-sub-menu :key="routes[1].name">
          <template #title>
            <span>{{ routes[1].meta.title }}</span>
          </template>
          <a-menu-item v-for="(item, index) in routes[1].children" :key="index" @click="changeMenu(item.path)">
            <span>{{ item.meta.title }}</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <router-view />
  </a-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { routes } from '../../router/index.ts'

const selectedKeys = ref([0])
const openKeys = ref([routes[1].name])

const route = useRoute()
const router = useRouter()

function changeMenu(path) {
  router.push({ path })
}

onMounted(() => {
  routes[1].children.forEach((item, index) => {
    if (route.name === item.name) {
      selectedKeys.value[0] = index
    }
  })
})
</script>

<style lang="less" scoped>
.ant-layout.ant-layout-has-sider {
  margin-top: 20px;
}

.ant-layout-sider {
  margin-right: 20px;
  min-height: calc(100vh - 154px);
}

:deep(.ant-menu-title-content) {
  display: flex;
  align-items: center;

  span {
    line-height: 0;
  }

  span:first-child {
    margin-right: 8px;
  }
}

@media screen and (max-width: 992px) {
  :deep(.ant-card) {
    min-width: calc(100vw - 40px);
    margin-right: 20px;
  }
}
</style>
