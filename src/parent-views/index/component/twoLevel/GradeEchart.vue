<script type="ts" setup>
  import { onMounted, watch, ref } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '<strong>{b}</strong> <br/>预警占比：{d}%'
    },
    legend: {
      orient: 'none',
      left: 'right',
      textStyle: {
        fontSize: 11,
      }
    },
    series: [
      {
        type: 'pie',
        radius: [10, 70],
        center: ['40%', '50%'],
        roseType: 'area',
        startAngle: 90,
        endAngle: 360,
        clockwise: true, // 逆时针绘制饼图
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 4
        },
        data: [
          { value: 12, name: '体脂偏低' },
          { value: 25, name: '步数过低' },
          { value: 34, name: '睡眠时间不规律' },
          { value: 5, name: '心理健康状态' },
        ]
      }
    ]
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
    chartInstance = echarts.init(document.querySelector('.grade-echart-box'))
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
    // 90 320 220 160
  })
</script>

<template>
  <div class="grade-echart-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .grade-echart-box {
    width: 100%;
    height: 200px;
  }
</style>
