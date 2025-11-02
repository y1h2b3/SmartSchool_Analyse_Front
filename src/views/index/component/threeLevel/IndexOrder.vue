<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import router from '@/router/index.ts'
  const services = [
    {
      title: '学生管理',
      image: '/src/assets/image/logo/学生管理.png',
      path: '/student-manage',
    },
    {
      title: '学生健康',
      image: '/src/assets/image/logo/学生心理健康.png',
      path: '/student-health',
    },
    {
      title: '消息通知',
      image: '/src/assets/image/logo/消息通知.png',
      path: '/msg-notice',
    },
    {
      title: '预约管理',
      image: '/src/assets/image/logo/校医预约.png',
      path: '/order-manage',
    },
    {
      title: '日志管理',
      image: '/src/assets/image/logo/日志管理.png',
      path: '/log',
    },
    {
      title: '学生预警',
      image: '/src/assets/image/logo/安全预警.png',
      path: '/student-warning',
    },
    {
      title: '学生健康分析',
      image: '/src/assets/image/logo/数据分析.png',
      path: '/student-data',
    },
    {
      title: '教师健康分析',
      image: '/src/assets/image/logo/药品订单.png',
      path: '/teacher-data',
    },
  ]
  const goToPath = (path) => {
    router.push(path)
  }
</script>

<template>
  <div class="order-content">
    <span class="title">热门服务</span>
    <div class="content">
      <el-descriptions column="4">
        <el-descriptions-item v-for="item in services" :key="item.path">
          <div class="service-item" @click="goToPath(item.path)">
            <!-- <img :src="item.image" mode="scaleToFill" class="logo" /> -->
            <el-icon :size="28" v-if="item.title === '学生管理'"><Avatar /></el-icon>
            <el-icon :size="28" v-else-if="item.title === '学生健康'"><Suitcase /></el-icon>
            <el-icon :size="28" v-else-if="item.title === '消息通知'"><ChatDotSquare /></el-icon>
            <el-icon :size="28" v-else-if="item.title === '预约管理'"><FirstAidKit /></el-icon>
            <el-icon :size="28" v-else-if="item.title === '日志管理'"><Tools /></el-icon>
            <el-icon :size="28" v-else-if="item.title === '学生预警'"><BellFilled /></el-icon>
            <el-icon :size="28" v-else-if="item.title === '教师健康分析'"><Histogram /></el-icon>
            <el-icon :size="28" v-else-if="item.title === '学生健康分析'"><Histogram /></el-icon>
            <span class="text">{{ item.title }}</span>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .order-content {
    width: 100%;
    height: 220px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    overflow: hidden;
    .title {
      width: 100%;
      height: 42px;
      padding: 10px;
      border-bottom: 1px solid #e1e1e1;
      box-sizing: border-box;
      font-weight: 700;
    }
    .content {
      padding-right: 5px;
      box-sizing: border-box;
      .el-descriptions {
        .service-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          .logo {
            width: 25px;
            height: 25px;
            background-size: cover;
          }
          .text {
            font-size: 14px;
            font-weight: 600px;
          }
        }
      }
    }
  }
</style>
