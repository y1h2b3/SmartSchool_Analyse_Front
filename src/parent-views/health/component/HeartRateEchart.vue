<script type="ts" setup>
  import { ref, onMounted, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const props = defineProps(['healthData'])
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  watch(
    () => SettingStore.isCollapse,
    () => {
      setTimeout(() => {
        inItEchart()
      }, 200)
    },
  )
  const heartData = ref([props.healthData.restingHeartRateMin, props.healthData.meanRestingHeartRate, props.healthData.restingHeartRateMax])
  const option = {
    grid: {
      top: '5%',
      left: '0%',
      right: '8%',
      bottom: '5%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      borderWidth: 0,
    },
    yAxis: {
      // 设置坐标轴的 文字样式
      axisLabel: {
        color: '#6E7079',
        margin: 20, // 刻度标签与轴线之间的距离。
      },
      // 坐标轴轴线相关设置。
      splitLine: {
        lineStyle: {
          color: '#E1E1E1',
        },
      },
    },
    xAxis: {
      splitLine: {
        show: false,
      },
      // 坐标轴轴线相关设置。
      axisLine: {
        lineStyle: {
          color: '#E1E1E1',
        },
      },
      type: 'category',
      data: ['min', 'mid', 'max'],
      axisLabel: {
        // 设置坐标轴的 文字样式
        color: '#6E7079',
        margin: 20, // 刻度标签与轴线之间的距离。
      },
      boundaryGap: false, // 设置坐标轴两边的留白 ，从刻度原点开始，
      axisTick: {
        // 取消坐标轴刻度线
        show: false,
      },
    },
    series: [
      {
        data: heartData.value,
        type: 'line',
        // smooth:false,   //关键点，为true是不支持虚线的，实线就用true
        symbolSize: 5, // 拐点圆的大小
        symbol: 'circle',
        markLine: {
          silent: true,
        },
        itemStyle: {
          normal: {
            color: '#67c1c1', // 设置 symbol的颜色
            lineStyle: {
              width: 1,
              color: '#67c1c1',
              type: 'solid', // 'dotted'虚线 'solid'实线
            },
          },
        },
      },
    ],
  }
  var chartInstance = null
  const inItEchart = () => {
    if (chartInstance) chartInstance.dispose()
    chartInstance = echarts.init(document.querySelector('.heart-rate-box'))
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="heart-rate-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .heart-rate-box {
    width: 340px;
    height: 200px;
  }
</style>
