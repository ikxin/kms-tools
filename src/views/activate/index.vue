<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" mode="inline" style="height: 100%">
        <a-sub-menu :key="routes[1].name">
          <template #title>
            <icon-park :type="routes[1].meta.icon" theme="outline" />
            <span>{{ routes[1].meta.title }}</span>
          </template>
          <a-menu-item v-for="(item, index) in routes[1].children" :key="index" @click="changeMenu(item.path)">
            <icon-park :type="item.meta.icon" theme="outline" />
            <span>{{ item.meta.title }}</span>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <router-view />
  </a-layout>
</template>

<script setup>
import { IconPark } from '@icon-park/vue-next/es/all'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { routes } from '../../router'

const selectedKeys = ref([0])
const openKeys = ref([routes[1].name])

const router = useRouter()
function changeMenu(path) {
  router.push({ path })
}
</script>

<style lang="less" scoped>
.ant-layout.ant-layout-has-sider {
  margin-top: 20px;
}

.ant-layout-sider {
  margin-right: 20px;
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
</style>