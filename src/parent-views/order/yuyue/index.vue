<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import SelectDialog from './component/SelectDialog.vue'
  import { searchStaffType } from '@/api/parent/order.ts'
  const dateList = ref([]) // 日期数组
  const doctorList = ref([]) // 在职医生
  const currentDateIndex = ref(0) // 展示当前日期的下标
  // 表格是否加载中
  const isLoading = ref<boolean>(false)
  const selectDialogVisible = ref<boolean>(false) // 查看弹窗是否展示
  const rowData = ref(null) // 查看的医生信息

  /**
   * 监听点击的日期
   */
  const handleCurrentDateIndex = (index: number) => {
    currentDateIndex.value = index
    freshData()
  }
  /**
   * 刷新数据
   */
  const freshData = () => {
    isLoading.value = true
    setTimeout(async () => {
      const resp = await searchStaffType('1')
      doctorList.value = resp.records
      isLoading.value = false
    }, 500)
  }
  /**
   * 查看详情
   */
  const openSelectDialog = (item) => {
    rowData.value = item
    // 开启弹窗
    selectDialogVisible.value = !selectDialogVisible.value
  }

  onMounted(() => {
    dateList.value.push(
      { num: 19, name: '周五' },
      { num: 20, name: '周六' },
      { num: 21, name: '周日' },
      { num: 22, name: '周一' },
      { num: 23, name: '周二' },
      { num: 24, name: '周三' },
      { num: 25, name: '周四' },
    )
    freshData()
  })
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <SelectDialog :selectDialogVisible="selectDialogVisible" :rowData="rowData"></SelectDialog>
      <div class="header">
        <div class="text-box">
          <span>心理</span>
          <span>顾问</span>
        </div>
        <el-scrollbar>
          <div class="scrollbar-flex-content">
            <template v-for="(item, index) in dateList" :key="item.num">
              <div
                class="scrollbar-demo-item"
                @click="handleCurrentDateIndex(index)"
                :class="{ 'scrollbar-demo-item-active': currentDateIndex === index }"
              >
                <span>{{ item.name }}</span>
                <div>
                  <span>{{ item.num }}日</span>
                </div>
              </div>
            </template>
          </div>
        </el-scrollbar>
      </div>
      <el-scrollbar>
        <div
          v-if="isLoading"
          class="loading-placeholder"
          v-loading="isLoading"
          element-loading-text="Loading..."
        >
          <el-empty :image-size="200" />
        </div>
        <div class="scrollbar-flex-doctorList" v-else>
          <template v-for="item in doctorList" :key="item.id">
            <div class="doctorList-item">
              <div class="left">
                <div class="logo"></div>
                <div class="info">
                  <span class="name">{{ item.name }}</span>
                  <span class="post">{{ item.location }}</span>
                </div>
              </div>
              <div class="right">
                <el-button type="primary" @click="openSelectDialog(item)">查看详情</el-button>
              </div>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .app-container-inner {
    width: 100%;
    height: 100%;
    padding: 0px;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    background-color: transparent;
    justify-content: flex-start;
    .header {
      width: 100%;
      height: 70px;
      display: flex;
      background-color: #fff;
      .text-box {
        width: 70px;
        height: 70px;
        background-color: #3ccfb6;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span {
          font-size: 20px;
          font-weight: 200;
          color: #fff;
        }
      }
      .scrollbar-flex-content {
        flex: 1;
        display: flex;
        .scrollbar-demo-item-active {
          background-color: #d9f0e8;
        }
        .scrollbar-demo-item {
          cursor: pointer;
          width: 70px;
          height: 70px;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          > span:nth-child(1) {
            font-size: 15px;
            opacity: 0.6;
          }
          > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            span:nth-child(1) {
              font-size: 15px;
              color: #3fcfb8;
            }
            span:nth-child(2) {
              font-size: 10px;
              opacity: 0.6;
            }
          }
        }
      }
    }
    .loading-placeholder {
      height: 76vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .scrollbar-flex-doctorList {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      .doctorList-item {
        width: 100%;
        height: 110px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        background-color: #fff;
        cursor: pointer;
        .left {
          width: 600px;
          height: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .logo {
            width: 80px;
            height: 80px;
            background-image: url('@/assets/image/avatar.png');
            background-size: cover;
            margin-left: 30px;
            border-radius: 10px;
          }
          .info {
            width: 300px;
            height: 80px;
            margin-left: 15px;
            display: flex;
            flex-direction: column;
            padding-top: 10px;
            box-sizing: border-box;
            > span:nth-child(1) {
              font-size: 16px;
              font-weight: 700;
              margin-bottom: 10px;
            }
            > span:nth-child(2) {
              font-size: 14px;
              opacity: 0.6;
            }
          }
        }
        .right {
          margin-right: 100px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  @media (max-width: 768px) {
    .app-container-inner {
      flex-direction: column;
    }
    .app-container-inner > * {
      width: 100%;
      height: auto;
    }
    .text-box {
      width: 120px !important;
    }
    .scrollbar-flex-content {
      width: 500px;
    }
  }
</style>
