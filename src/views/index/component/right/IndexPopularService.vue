<script lang="ts" setup>
import router from '@/router/index.ts'
const services = [
  {
    title: '学生管理',
    image: '/src/assets/image/logo/学生管理.png',
    path: '/personnelManagement/student',
  },
  {
    title: '学生健康',
    image: '/src/assets/image/logo/学生心理健康.png',
    path: '/healthManagement/student',
  },
  {
    title: '消息通知',
    image: '/src/assets/image/logo/消息通知.png',
    path: '/msgNotification/main',
  },
  {
    title: '校医预约',
    image: '/src/assets/image/logo/校医预约.png',
    path: '/medicalServices/hospitalInfo/order',
  },
  {
    title: '药品订单',
    image: '/src/assets/image/logo/药品订单.png',
    path: 'medicalServices/medicalInfo/medicalOrder',
  },
  {
    title: '日志管理',
    image: '/src/assets/image/logo/日志管理.png',
    path: '/systemAdministration/systemAdministration/log',
  },
  {
    title: '学生预警',
    image: '/src/assets/image/logo/安全预警.png',
    path: '/alertNotice/studentNotice',
  },
  {
    title: '数据分析',
    image: '/src/assets/image/logo/数据分析.png',
    path: '/dataAnalytics/studentData',
  },
]
const goToPath = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="service-content">
    <el-descriptions title="热门服务" column="4">
      <el-descriptions-item v-for="item in services" :key="item.path">
        <div class="service-item" @click="goToPath(item.path)">
          <img :src="item.image" mode="scaleToFill" class="logo" />
          <span class="text">{{ item.title }}</span>
        </div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style lang="scss" scoped>
.service-content {
  width: 100%;
  margin-top: 7px;
  .el-descriptions {
    .service-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 30px;
      cursor: pointer;
      .logo {
        width: 50px;
        height: 50px;
        background-size: cover;
      }
      .text {
        margin-top: 5px;
        font-size: 14px;
        font-weight: 600px;
      }
    }
  }
}
</style>
