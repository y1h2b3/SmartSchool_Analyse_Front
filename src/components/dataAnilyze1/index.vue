<template>
  <div ref="chartsRef" class="echarts" />
</template>
<script lang="ts" setup>
  import * as echarts from 'echarts'
  import { EChartsType } from 'echarts/core'
  import { onMounted, ref } from 'vue'
  const chartsRef = ref<HTMLElement | null>()
  const option = {
    title: {
      text: '',
    },
    tooltip: {},
    legend: {
      // data: ['第一标准', '第二标准', '第三标准'],
      x: 'center',
      y: 'bottom',
      textStyle: {
        color: '#fff',
      },
    },
    color: ['#4c95d9', '#f6731b', '#8cd43f'],
    radar: {
      name: {
        textStyle: {
          //设置颜色
          color: '#fff',
        },
      },
      indicator: [
        { name: '体重', max: 6500 },
        { name: '身高', max: 16000 },
        { name: '睡眠', max: 30000 },
        { name: '步数', max: 38000 },
        { name: '运动', max: 52000 },
        { name: '体脂', max: 25000 },
      ],
      center: ['50%', '50%'],
      radius: '58%',
    },
    series: [
      {
        name: '',
        type: 'radar',
        itemStyle: {
          normal: {
            splitLine: {
              lineStyle: {},
            },
            label: {
              show: false,
              textStyle: {},
              formatter: function (params) {
                return params.value
              },
            },
          },
        },
        data: [
          {
            value: [2400, 10000, 28000, 35000, 50000, 19000],
            name: '优秀',
          },
          {
            value: [5000, 14000, 28000, 31000, 42000, 21000],
            name: '正常',
          },
          {
            value: [6000, 14000, 18000, 21000, 32000, 11000],
            name: '较差',
          },
        ],
      },
    ],
  }

  let chart: EChartsType
  const initChart = () => {
    const chart = echarts.init(chartsRef.value)
    chart.setOption(option)
    return chart
  }
  onMounted(() => {
    chart = initChart()
    window.addEventListener('resize', function () {
      chart && chart.resize()
    })
  })
</script>

<style lang="scss" scoped>
  .echarts {
    width: 100%;
    height: 100%;
  }
</style>