<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { getAllStudentInfo } from '@/api/admin/personnelManagement/student.js'
  import { useUserStore } from '../../../store/modules/user'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  const settingStore = useSettingStore()
  const UserStore = useUserStore()
  const myData = ref({
    num: '100+',
    username: '张张张',
    steps: 6417,
  })
  const dataList = ref([])

  const getStepsTop = async () => {
    const resp = await getAllStudentInfo()
    let steps = 34100
    for (let i = 0; i < 100; i++) {
      dataList.value.push({
        username: resp[i].name,
        steps: steps,
      })
      steps = steps - Math.floor(Math.random() * 500)
    }
  }
  onMounted(() => {
    getStepsTop()
    myData.value.username = UserStore.userInfo?.studentName || '未知姓名'
  })
</script>

<template>
  <div class="header">
    <h5>今日步数排行榜</h5>
  </div>
  <el-scrollbar
    class="run-top-content"
    :style="{ height: `${settingStore.isFull ? 465 : 340}px !important` }"
  >
    <div class="scrollbar-item">
      <!--  当前用户的排名 -->
      <div class="box" style="margin-bottom: 10px">
        <span class="top">{{ myData.num }}</span>
        <div>
          <div>
            <img src="/src/assets/image/avatar.png" class="logo" />
            <span class="name">{{ myData.username }}</span>
          </div>
          <div>
            <span class="val" :class="{ 'val-active': true }">{{ myData.steps }}</span>
          </div>
        </div>
      </div>
      <template v-for="(item, index) in dataList" :key="index">
        <div class="box">
          <span class="top">{{ index + 1 }}</span>
          <div>
            <div>
              <img src="/src/assets/image/avatar.png" class="logo" />
              <span class="name">{{ item.username }}</span>
            </div>
            <div>
              <span class="val">{{ item.steps }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
  .header {
    width: 100%;
    height: 50px;
    background-color: #409eff;
    display: flex;
    justify-content: center;
    align-items: center;
    h5 {
      font-size: 15px;
      color: #fff;
      font-weight: 500;
    }
  }
  .run-top-content {
    width: 100%;
    height: 340px;
    background-color: #f0f2f5 !important;
    cursor: pointer;
    .scrollbar-item {
      .box {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        background-color: #fff;
        .top {
          display: inline-block;
          width: 50px;
          text-align: center;
          box-sizing: border-box;
          font-weight: 700;
        }
        > div {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f5f5f5;
          > div:nth-child(1) {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .logo {
              width: 30px;
              height: 30px;
            }
            .name {
              margin-left: 10px;
              font-size: 14px;
              font-family: '微软雅黑';
            }
          }
          > div:nth-child(2) {
            padding-right: 15px;
            .val-active {
              color: #09ac55 !important;
            }
            .val {
              font-size: 20px;
              font-weight: 600;
              color: #eaa24e;
            }
          }
        }
      }
    }
  }
</style>
