<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import {
    getStudentToTal,
    getParentToTal,
    getTeacherToTal,
    getLogisticsToTal,
  } from '@/api/admin/index/index.ts'
  const studentTotal = ref(0)
  const parentTotal = ref(0)
  const teacherTotal = ref(0)
  const logisticsTotal = ref(0)
  const tableList = ref([
    {
      content: `学生总人数：`,
      timestamp: '人',
      type: 'primary',
    },
    {
      content: `监护人总人数：`,
      timestamp: '人',
      type: 'danger',
    },
    {
      content: `教师总人数：`,
      timestamp: '人',
      type: 'success',
    },
    {
      content: `后勤总人数：`,
      timestamp: '人',
      type: 'danger',
    },
  ])
  const getTotal = (index) => {
    switch (index) {
      case 0:
        return studentTotal.value
      case 1:
        return parentTotal.value
      case 2:
        return teacherTotal.value
      case 3:
        return logisticsTotal.value
    }
  }
  onMounted(async () => {
    studentTotal.value = await getStudentToTal()
    parentTotal.value = await getParentToTal()
    teacherTotal.value = await getTeacherToTal()
    logisticsTotal.value = await getLogisticsToTal()
  })
</script>

<template>
  <div class="order-content">
    <span class="title">全校总人数</span>
    <div class="content">
      <el-empty :image-size="80" description="暂无预约信息" v-if="tableList.length === 0" />
      <template v-else>
        <el-timeline class="my-el-timeline">
          <el-timeline-item
            v-for="(item, index) in tableList"
            :key="index"
            size="normal"
            :type="item.type"
          >
            {{ item.content + getTotal(index) + item.timestamp }}
          </el-timeline-item>
        </el-timeline>
      </template>
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
      .el-empty {
        margin-top: -20px;
      }
      .my-el-timeline {
        margin-left: -10px;
        margin-top: 10px;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
