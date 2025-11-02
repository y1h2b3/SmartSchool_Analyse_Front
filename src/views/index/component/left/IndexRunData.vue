<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  import * as echarts from 'echarts'
  const SettingStore = useSettingStore()
  const echartRef = ref<HTMLElement>(null)
  var option = {
    xAxis: {
      show: true, //去掉x轴刻度线
      type: 'category',
      boundaryGap: false, // 设置为 false，让轴线两侧没有留白
      axisLabel: {
        interval: 0, // 设置坐标轴标签全部显示
        rotate: 0, // 设置标签不旋转
      },
      axisLine: {
        lineStyle: {
          color: '#FCB68C',
        },
      },
      data: ['27日', '28日', '29日', '30日', '31日', '32日', '1日'],
    },
    yAxis: {
      show: false, //去掉x轴刻度线
      type: 'value',
      axisLabel: {
        interval: 0, // 设置坐标轴标签全部显示
      },
      data: [0, 500, 1500, 3500, 5000, 7500, 10000],
    },
    series: [
      {
        breadcrumb: { show: false },
        data: [0, 230, 224, 8760, 2380, 6300, 9999],
        type: 'line',
        itemStyle: {
          color: '#fff',
        },
        lineStyle: {
          width: 3,
          type: 'solid',
        },
        symbolSize: 8,
        symbol: 'circle',
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#fff',
          },
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' },
          ],
          label: {
            show: true,
            formatter: '{b} : {c}',
            position: 'top',
            textStyle: {
              fontSize: 10,
            },
          },
        },
      },
    ],
  }
  watch(
    () => SettingStore.isCollapse,
    () => {
      setTimeout(() => {
        inItEchart()
      }, 200)
    },
  )
  var chartInstance = null
  const inItEchart = () => {
    if (chartInstance) chartInstance.dispose()
    chartInstance = echarts.init(echartRef.value)
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="run-content">
    <div class="header">
      <div class="left">
        <span>步数</span>
        <span>日平均值：6642</span>
      </div>
      <div class="right">
        <span>1999步</span>
        <span></span>
      </div>
    </div>
    <div class="echart-box" ref="echartRef"></div>
  </div>
</template>

<style lang="scss" scoped>
  .run-content {
    width: 100%;
    margin-top: 20px;
    padding-top: 10px;
    box-sizing: border-box;
    height: 300px;
    background-color: #ff7850;
    border-radius: 10px;
    overflow: hidden;
    .header {
      width: 85%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ffb78d;
      margin-left: 30px;
      padding-bottom: 10px;
      box-sizing: border-box;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        > span:nth-child(1) {
          font-size: 18px;
          color: #fff;
        }
        > span:nth-child(2) {
          font-size: 12px;
          color: #fff;
          opacity: 0.4;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: right;
        > span:nth-child(1) {
          font-size: 18px;
          color: #fff;
        }
        > span:nth-child(2) {
          font-size: 12px;
          color: #fff;
          opacity: 0.4;
        }
      }
    }
    .echart-box {
      width: 100%;
      height: 300px;
      margin-top: -40px;
    }
  }
</style>
