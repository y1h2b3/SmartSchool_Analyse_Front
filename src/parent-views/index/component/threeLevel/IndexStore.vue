<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { getWarnById } from '@/api/admin/alertNotice/student.ts'
  import dayjs from 'dayjs'
  import { useUserStore } from '@/store/modules/user'
  const UserStore = useUserStore()
  const tableList = ref([])
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  onMounted(async () => {
    const id = UserStore.userInfo?.studentId
    const resp = await getWarnById(id)
    console.log(resp)
    const rows = resp.slice(0, 3)
    for (let i = 0; i < rows.length; i++) {
      tableList.value.push({
        content: rows[i].type,
        timestamp: formatDate(rows[i].time),
        type: rows[i].level === '高' ? 'danger' : rows[i].level === '中' ? 'primary' : 'warning',
      })
    }
  })
</script>

<template>
  <div class="order-content">
    <span class="title">我的预警</span>
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
