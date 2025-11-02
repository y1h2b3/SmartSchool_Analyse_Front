<script type="ts" setup>
  import { onMounted, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  const data = [29, 42, 92];
  var option = {
    grid: {
      left: '2%',
      right: '10%',
      top: '0%',
      bottom: '0%',
      containLabel: true // 是否包含坐标轴的刻度标签
    },
    xAxis: {
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      data: ['高', '中', '低'],
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        realtimeSort: true,
        type: 'bar',
        data: data,
        barWidth: '50%',
        label: {
          show: true,
          position: 'right',
          valueAnimation: true
        }
      }
    ],
    legend: {
      show: true
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
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
    chartInstance = echarts.init(document.querySelector('.echart-box'))
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="echart-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .echart-box {
    width: 100%;
    height: 200px;
  }
</style>
