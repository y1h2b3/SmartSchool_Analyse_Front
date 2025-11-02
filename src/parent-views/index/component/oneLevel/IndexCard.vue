<script lang="ts" setup>
  import { ref } from 'vue'
  import IndexHeade from './IndexHeader.vue'
  import { useUserStore } from '../../../../store/modules/user'
  const UserStore = useUserStore()
  const weatherList = ref([
    { logo: '/src/assets/image/index/温度-黑.png', value: '26℃', key: '室外温度' },
    { logo: '/src/assets/image/index/湿度-黑.png', value: '96%', key: '室外湿度' },
    { logo: '/src/assets/image/index/多云-黑.png', value: '90.5%', key: '云量' },
    { logo: '/src/assets/image/index/紫外线-黑.png', value: '最弱', key: '紫外线' },
    { logo: '/src/assets/image/index/体感-黑.png', value: '24℃', key: '体感' },
  ])
</script>

<template>
  <div class="card-content">
    <div class="header">
      <div class="top">
        <span class="title">你好，{{ UserStore.userInfo.username }}！</span>
        <IndexHeade></IndexHeade>
        <!-- <el-icon style="cursor: pointer"><MoreFilled /></el-icon> -->
      </div>
      <div class="bottom">
        <span>当前健康指数正常，希望你继续保持健康的状态！</span>
      </div>
    </div>
    <div class="footer">
      <template v-for="item in weatherList" :key="item.value">
        <div class="weather-item">
          <div class="logo" :style="{ backgroundImage: `url(${item.logo})` }"></div>
          <span class="value">{{ item.value }}</span>
          <span class="key">{{ item.key }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .card-content {
    width: 100%;
    padding: 5px 20px 20px 20px;
    box-sizing: border-box;
    height: 240px;
    /* background: linear-gradient(to bottom right, #45c4eb, #39a1c1); */
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    .header {
      width: 100%;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .top {
        width: 100%;
        height: auto;
        padding: 5px 0;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .title {
          font-size: 15px;
          color: #000;
          font-weight: 700;
        }
        .logo {
          width: 20px;
          height: 20px;
        }
      }
      .bottom {
        width: 90%;
        > span {
          font-size: 12px;
          color: #000;
          opacity: 0.7;
        }
      }
    }
    .footer {
      margin-top: 15px;
      width: 100%;
      flex: 1;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .weather-item {
        width: 100px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        .logo {
          width: 50px;
          height: 50px;
          background-image: url('/src/assets/test.jpg');
          background-size: cover;
        }
        .value {
          font-size: 18px;
          color: #000;
        }
        .key {
          font-size: 12px;
          color: #000;
          opacity: 0.6;
        }
      }
    }
  }
</style>
