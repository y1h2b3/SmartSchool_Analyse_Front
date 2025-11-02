<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb" mode="out-in">
      <!-- 首页面包屑不要可以直接删除 -->
      <el-breadcrumb-item :to="{ path: '/' }" key="home" v-if="matched[0].meta.title !== '首页'">
        <div class="breadcrumb-item">
          <span class="breadcrumb-title">首页</span>
        </div>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in matched" :key="item.name">
        <span
          v-if="item.redirect === 'noRedirect' || index == matched.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else>{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const matched = computed(() =>
    route.matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false),
  )
</script>
