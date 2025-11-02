<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import NotificationSide from './component/notificationSide.vue'
  import NotificationEmail from './component/notificationEmail.vue'
  import NotificationEmailDetail from './component/notificationEmailDetail.vue'
  import { ref } from 'vue'
  const navIndex = ref(1)
  const currentClickEmailIndex = ref(0)
  const currentClickEmail = ref({}) // 当前点击的邮件内容

  const updateNavIndex = (val) => {
    navIndex.value = val
  }
  const updateCurrentClickEmailIndex = (val) => {
    currentClickEmailIndex.value = val
  }
  const updateCurrentClickEmail = (val) => {
    currentClickEmail.value = val
  }
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner content">
      <NotificationSide :navIndex="navIndex" @update-navIndex="updateNavIndex"></NotificationSide>
      <NotificationEmail
        :currentClickEmailIndex="currentClickEmailIndex"
        @update-navIndex="updateNavIndex"
        @update-currentClickEmailIndex="updateCurrentClickEmailIndex"
        @update-currentClickEmail="updateCurrentClickEmail"
        v-if="navIndex === 1"
      ></NotificationEmail>
      <NotificationEmailDetail
        :currentClickEmail="currentClickEmail"
        @update-navIndex="updateNavIndex"
        v-else-if="navIndex === 2"
      ></NotificationEmailDetail>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    padding: 0px !important;
    display: flex;
    background-color: #ebedf0;
  }
</style>
