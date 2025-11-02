<script type="ts" setup>
  import { onMounted, watch } from 'vue'
  const props = defineProps(['dialogVisible'])
  import * as echarts from 'echarts'
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['身高', '体重', '体脂率', 'BMI']
    },
    grid: {
      left: '2%',
      right: '6%',
      bottom: '2%',
      top: '10%',
      containLabel: true
    },
    xAxis: [
      {
        show: true,
        type: 'category',
        boundaryGap: false,
        data: ['周六', '周日', '周一', '周二', '周三', '周四', '周五']
      }
    ],
    yAxis: [
      {
        show: true,
        type: 'value'
      }
    ],
    series: [
      {
        name: '身高',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [169, 169, 169, 169, 169, 169, 169]
      },
      {
        name: '体重',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [121, 124, 119, 120, 121, 122, 124]
      },
      {
        name: '体脂率',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [15, 18, 22, 17, 17, 16, 19]
      },
      {
        name: 'BMI',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [24.3, 23.2, 24.4, 22.4, 25.2, 23.2, 21.2]
      },
    ],
  };
  watch(
    () => props.dialogVisible,
    () => {
      inItEchart()
    }
  )
  var chartInstance = null
  const inItEchart = () => {
    if (chartInstance) chartInstance.dispose()
    chartInstance = echarts.init(document.querySelector('.warning-echart-box'))
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="warning-echart-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .warning-echart-box {
    width: 460px;
    height: 255px;
  }
</style>
