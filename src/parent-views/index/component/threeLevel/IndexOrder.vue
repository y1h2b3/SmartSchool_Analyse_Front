<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { searchStaffOrders } from '@/api/parent/order.ts'
  import dayjs from 'dayjs'
  const tableList = ref([])
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  const getStaffType = (ststus) => {
    if (ststus === '已预约') {
      return 'primary'
    } else if (ststus === '已完成') {
      return 'success'
    } else if (ststus === '已取消') {
      return 'warning'
    } else if (ststus === '异常') {
      return 'danger'
    }
  }
  onMounted(async () => {
    const resp = await searchStaffOrders(1, 3)
    let rows = resp.records
    for (let i = 0; i < rows.length; i++) {
      tableList.value.push({
        content: `预约地点: ${rows[i].location}`,
        timestamp: formatDate(rows[i].createTime),
        type: getStaffType(rows[i].status),
      })
    }
  })
</script>

<template>
  <div class="order-content">
    <span class="title">我的预约</span>
    <div class="content">
      <el-empty :image-size="80" description="暂无预约信息" v-if="tableList.length === 0" />
      <template v-else>
        <el-timeline class="my-el-timeline">
          <el-timeline-item
            v-for="(item, index) in tableList"
            :key="index"
            :timestamp="item.timestamp"
            size="normal"
            :type="item.type"
          >
            {{ item.content }}
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
