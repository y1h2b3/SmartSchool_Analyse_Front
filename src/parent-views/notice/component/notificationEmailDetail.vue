<script lang="ts" setup>
  import { ref, getCurrentInstance, onMounted, computed } from 'vue'
  import dayjs from 'dayjs'
  const props = defineProps(['currentClickEmail'])
  const isShowDetail = ref(true)
  const instance = getCurrentInstance()
  /**
   * 返回上一层
   */
  const onReturnRouter = () => {
    instance.emit('update-navIndex', 1)
  }
  onMounted(() => {
    console.log(props.currentClickEmail)
  })
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }
  const colorArr = ['primary', 'success', 'warning']
  const groupArr = computed(() => {
    let group = props.currentClickEmail.notifyGroup
    group = group.substr(1, group.length - 2)
    return group.split(',')
  })
</script>

<template>
  <div class="content">
    <div class="header">
      <el-button size="small" @click="onReturnRouter">返回</el-button>
    </div>
    <div class="email-box">
      <span class="title">{{ props.currentClickEmail.title }}</span>
      <div class="writer" v-if="isShowDetail">
        <div class="left">
          <span>{{ props.currentClickEmail.publisher }}</span>
          <span>发给</span>
          <span>我</span>
        </div>
        <div class="right">
          <span class="date">{{ formatDate(props.currentClickEmail.time) }}</span>
          <span class="writerDetail" @click="isShowDetail = !isShowDetail">详细信息</span>
        </div>
      </div>
      <div class="writer_detail" v-else>
        <div class="left">
          <div>
            <span style="color: #5c6166">发件人：</span>
            <span style="margin-right: 5px; color: #959dae">
              {{ props.currentClickEmail.publisher }}
            </span>
          </div>
          <div>
            <span style="color: #5c6166">通知群体：</span>
            <template v-for="(item, index) in groupArr" :key="index">
              <el-tag :type="colorArr[index]">{{ item }}</el-tag>
            </template>
          </div>
        </div>
        <div class="right">
          <span class="date">{{ formatDate(props.currentClickEmail.time) }}</span>
          <span class="writerDetail" @click="isShowDetail = !isShowDetail">详细信息</span>
        </div>
      </div>
      <div class="line"></div>
      <span class="text">
        {{ props.currentClickEmail.content }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    flex: 1;
    height: 100%;
    background-color: #fff !important;
    flex-direction: column;
    .el-tag {
      width: 50px;
      height: 23px;
      font-size: 12px;
      margin-right: 10px;
    }
    .header {
      margin: 10px;
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-radius: 5px;
      background-color: #e3ecfa;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .email-box {
      padding: 0 30px;
      line-height: 30px;
      box-sizing: border-box;
      .title {
        font-size: 18px;
        font-weight: 700;
      }
      .writer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        padding-left: 20px;
        box-sizing: border-box;
        cursor: pointer;
        .left {
          > span {
            margin: 0 5px;
          }
          > span:nth-child(1),
          > span:nth-child(3) {
            font-weight: 600;
          }
          > .span:nth-child(2) {
            color: #5c6166;
            margin: 0 20px;
          }
        }
        .right {
          .date {
            color: #959dae;
            margin-right: 20px;
          }
          .writerDetail {
            color: #90b3e8;
          }
        }
      }
      .writer_detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        padding-left: 20px;
        box-sizing: border-box;
        cursor: pointer;
        .left {
          flex: 1;
        }
        .right {
          display: flex;
          justify-content: flex-start;
          align-content: flex-start;
          .date {
            color: #959dae;
            margin-right: 20px;
          }
          .writerDetail {
            color: #90b3e8;
          }
        }
      }
      .line {
        width: 100%;
        height: 1px;
        background-color: #e8eaec;
        margin: 20px 0 30px 0;
      }
      .text {
        font-size: 18px;
      }
    }
  }
</style>
