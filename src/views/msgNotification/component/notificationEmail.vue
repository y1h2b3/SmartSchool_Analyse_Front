<script lang="ts" setup>
  import { ref, onMounted, getCurrentInstance, watch } from 'vue'
  import { getNotifications, deleteNotificationsById } from '@/api/admin/msgNotification/index.ts'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  import dayjs from 'dayjs'
  import { ElMessage, ElMessageBox } from 'element-plus'
  const SettingStore = useSettingStore()
  const props = defineProps(['currentClickEmailIndex'])
  const instance = getCurrentInstance()
  const tableList = ref([])
  const total = ref(0)
  // 表格是否加载中
  const isLoading = ref<boolean>(false)
  // 多选框是否全选
  const checkAll = ref(false)
  const isIndeterminate = ref(false)
  const checkedCities = ref([])
  const cities = ref([])
  const handleCheckAllChange = (val: boolean) => {
    checkedCities.value = val ? cities.value : []
    isIndeterminate.value = false
  }
  const handleCheckedCitiesChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === cities.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < cities.value.length
  }
  const currentPage = ref(1)
  const pageSize = ref(20)
  // 监听当前页显示条数
  const handleSizeChange = (value) => {
    pageSize.value = value
    freshData()
  }
  // 监听当前页数
  const handleCurrentChange = (value) => {
    currentPage.value = value
    freshData()
  }
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  /**
   * 进入邮件详情
   */
  const goToEmailDetail = (index) => {
    // 将邮件信息更新为当前点击的内容
    instance.emit('update-currentClickEmail', tableList.value[index])
    // 高亮显示当前点击的行
    instance.emit('update-currentClickEmailIndex', index)
    // 显示邮件详情
    instance.emit('update-navIndex', 2)
  }
  /**
   * 删除指定的通知信息
   */
  const deleteNotifications = async () => {
    await ElMessageBox.confirm('请确认是否要删除该消息？', '提示', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    checkedCities.value.map(async (notifyId) => {
      await deleteNotificationsById(notifyId)
    })
    // 高亮显示当前点击的行
    instance.emit('update-currentClickEmailIndex', 0)
    // 刷新数据
    checkedCities.value = []
    isIndeterminate.value = false
    freshData()
    ElMessage.success('删除成功')
  }
  /**
   * 刷新数据
   */
  const freshData = async () => {
    isLoading.value = true
    setTimeout(async () => {
      const current = currentPage.value
      const size = pageSize.value
      const user = ''
      const resp = await getNotifications(current, size, user)
      tableList.value = resp.records
      console.log(tableList.value)
      tableList.value.map((item) => {
        cities.value.push(item.notifyId)
      })
      total.value = resp.total
      isLoading.value = false
    }, 500)
  }
  onMounted(() => {
    freshData()
  })
</script>

<template>
  <div class="content">
    <div class="header">
      <div class="top">
        <h4>收件箱 · {{ total }}</h4>
      </div>
      <div class="bottom">
        <el-checkbox
          class="is-choose"
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        ></el-checkbox>
        <el-button type="danger" size="small" @click="deleteNotifications">删除</el-button>
      </div>
    </div>
    <el-scrollbar
      class="el-scrollbar"
      :style="{ maxHeight: `${SettingStore.isFull ? 660 : 525}px !important` }"
    >
      <div
        v-if="isLoading"
        class="loading-placeholder"
        v-loading="isLoading"
        element-loading-text="Loading..."
      >
        <el-empty :image-size="200" />
      </div>
      <div
        class="msg-box"
        v-for="(item, index) in tableList"
        :key="item.notifyId"
        :class="{ 'msg-box-active': props.currentClickEmailIndex === index }"
        v-else
      >
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox class="is-choose" :label="item.notifyId" :value="item.notifyId">
            <br />
          </el-checkbox>
        </el-checkbox-group>
        <div class="right" @click="goToEmailDetail(index)">
          <div>
            <div class="icon-box">
              <el-icon class="icon"><Promotion /></el-icon>
              <span>普通通知</span>
            </div>
            <span class="title">{{ item.title }}</span>
            <span class="sub-title">{{ item.content }}</span>
          </div>
          <span class="time">{{ formatDate(item.time) }}</span>
        </div>
      </div>
    </el-scrollbar>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        small
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    flex: 1;
    height: 100%;
    background-color: #fff !important;
    flex-direction: column;
    .header {
      box-sizing: border-box;
      height: 80px;
      .top {
        padding: 0 20px;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        h4 {
          font-size: 14px;
          margin: 0;
        }
        > h4:nth-child(2) {
          margin: 0 15px;
        }
        span {
          font-size: 12px;
          color: #5e6266;
          margin-top: 2px;
        }
      }
      .bottom {
        margin: 0 10px;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-radius: 5px;
        background-color: #e3ecfa;
        padding: 0 30px;
        box-sizing: border-box;
        .el-button {
          margin: 0 20px;
        }
      }
    }
    .el-scrollbar {
      margin-top: 10px;
      padding: 0 20px;
      box-sizing: border-box;
      cursor: pointer;
      .loading-placeholder {
        height: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .msg-box {
        height: 40px;
        border-bottom: 1px solid #e6e8eb;
        display: flex;
        align-items: center;
        font-size: 14px;
        .is-choose {
          padding: 20px 5px 20px 20px;
          box-sizing: border-box;
        }
        .right {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > div {
            flex: 1;
            display: flex;
            align-items: center;
            text-align: left;
            .icon-box {
              padding: 5px 10px 5px 8px;
              margin: 0 30px 0 5px;
              border-radius: 5px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              background-color: #2a8aee;
              .icon {
                margin-right: 5px;
                color: #fff;
              }
              span {
                font-size: 10px;
                color: #fff;
              }
            }
            .title {
              width: 200px;
              height: 100%;
              display: inline-block;
              overflow: hidden;
            }
            .sub-title {
              flex: 1;
              overflow: hidden;
              opacity: 0.8;
            }
          }
          .time {
            width: 190px;
            text-align: right;
            color: #959da6;
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;
          }
        }
      }
      .msg-box:hover {
        background-color: #f5f6f7;
      }
      .msg-box-active {
        background-color: #edf0f2;
      }
    }
    .demo-pagination-block {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
    }
  }
</style>
