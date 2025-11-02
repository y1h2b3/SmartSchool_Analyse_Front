<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  const props = defineProps(['option'])
  const option = ref({})
  const progressWidth = ref(120)
  const viewInfoClick = (name) => {
    console.log('Hello World')
  }
  onMounted(() => {
    option.value = props.option || {}
  })
</script>

<template>
  <el-card class="item">
    <div slot="header" class="clearfix">
      <div class="titleBox">
        <div
          class="logo"
          :style="{ backgroundImage: `url(./src/assets/image/index/${option.image}.png)` }"
        ></div>
        <span class="title">
          {{ option.name || '指标名称' }}
        </span>
        <el-popover placement="bottom-start" width="220" trigger="click">
          <strong>用途：</strong>{{ option.purpose || '暂无用途' }}
          <i class="el-icon-question" slot="reference"></i>
          <!-- <el-button slot="reference">hover 激活</el-button> -->
        </el-popover>
      </div>
      <template v-if="option.name === '今日步数'">
        <strong>目标步数：{{ option.allWeight || 0 }}</strong>
      </template>
      <template v-else-if="option.name === '今日睡眠'">
        <strong>目标睡眠时长: {{ option.allWeight || 0 }}小时</strong>
      </template>
      <template v-else-if="option.name === '今日卡路里'">
        <strong>目标摄入卡路里: {{ option.allWeight || 0 }}</strong>
      </template>
    </div>
    <div class="viewInfo">
      <div
        class="progressView"
        :style="{ width: progressWidth + 'px', height: progressWidth + 'px' }"
        @click="viewInfoClick(option.name)"
      >
        <el-progress
          type="circle"
          color="#8080bf"
          :width="progressWidth"
          :percentage="option.zbVal || 0"
          :stroke-width="progressWidth / 10"
          :show-text="false"
        ></el-progress>
        <div class="formatText">
          <p class="label">{{ option.zbName }}</p>
          <p class="value">{{ option.zbVal || 0 }}%</p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="Info">
        <div class="textItem" v-for="(item_1, index_1) in option.detailList" :key="index_1">
          <!-- <img src="" /> -->
          <span class="text">{{ item_1.name }} ：{{ item_1.value || 0 }}</span>
        </div>
      </div>
    </div>
  </el-card>
  <!-- 定义svg，用于环形进度渐变 -->
  <div style="width: 0px; height: 0px">
    <svg width="100%" height="100%">
      <defs>
        <linearGradient id="write" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color: #02e4dc" stop-opacity="0.9"></stop>
          <stop offset="100%" style="stop-color: #0271e2" stop-opacity="0.7"></stop>
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
  .item {
    width: 100%;
    height: 240px;
    border-radius: 5px;
    margin: 0px;
    .clearfix {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      strong {
        font-size: 13px;
        color: #4298f3;
      }
      .titleBox {
        width: auto;
        max-width: calc(100% - 85px);
        display: flex;
        align-items: center;
        .logo {
          width: 30px;
          height: 28px;
          background-image: url('./src/assets/image/index/今日步数.png');
          background-size: cover;
          background-repeat: no-repeat;
          margin-right: 5px;
        }
        .title {
          display: inline-block;
          width: 150px;
          max-width: calc(100% - 39px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 14.5px;
          font-weight: 700;
        }
        .el-icon-question {
          font-size: 15px;
          margin: 3px 0 0 5px;
          cursor: pointer;
          color: #4298f3;
        }
      }
      &::after,
      &::before {
        display: none;
        clear: both;
      }
    }
    .viewInfo {
      height: 100%;
      margin-top: 15px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .progressView {
        cursor: pointer;
        position: relative;
        .formatText {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(calc(-50% + 6px), -50%);
          width: calc(64%);
          height: calc(64%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          align-content: center;
          text-align: center;
          border-radius: 50%;
          -webkit-box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.18);
          box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.18);
          .label {
            width: 100%;
            margin: 0px;
            font-size: clamp(12px, 1.1vw, 13px);
            font-weight: 600;
            opacity: 0.9;
          }
          .value {
            width: 100%;
            margin: 0px;
            font-size: clamp(14px, 1.8vw, 19px);
            font-weight: 600;
            color: #083bb5;
          }
        }
      }
      .Info {
        width: 50%;
        .textItem {
          width: 100%;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 28px;
            margin-right: 5px;
          }
          .text {
            width: calc(100% - 35px);
            font-size: 13px;
            color: #666;
            font-weight: 600;
          }
        }
      }
      ::v-deep(.el-divider--vertical) {
        width: 1px;
        height: calc(100% - 40px);
        background-color: #ddd;
        box-shadow: -4.5px 0 12px 3px rgba(0, 0, 0, 0.1);
      }
      .el-progress {
        margin: 0 6px;
        position: relative;
        // 修改进度条文字提示颜色
        .el-progress__text {
          color: red;
        }
      }
      ::v-deep(svg > path:nth-child(2)) {
        stroke: url(#write); // #write 此处的id就是定义的svg标签id 做替换即可
      }
      ::v-deep(.el-progress path:first-child) {
        // 修改进度条背景色
        stroke: #e1e1e1;
      }
      ::v-deep(.el-progress-circle) {
        transform: rotateY(180deg);
      }
    }
    ::v-deep(.el-card__header) {
      width: 100%;
      padding: 10px;
    }
    ::v-deep(.el-card__body) {
      padding: 10px;
      height: calc(100% - 64.8px);
    }
  }
</style>
