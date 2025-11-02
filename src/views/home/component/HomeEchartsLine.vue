<script setup>
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'
  const lineRef = ref(HTMLElement | null)
  const lineOptions = ref({
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} °C',
      },
    },
    series: [
      {
        name: 'Lowest',
        type: 'line',
        data: [12, 14, 19, 21, 18, 14, 7],
        markPoint: {
          data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }],
        },
        markLine: {
          data: [
            { type: 'average', name: 'Avg' },
            [
              {
                symbol: 'none',
                x: '90%',
                yAxis: 'max',
              },
              {
                symbol: 'circle',
                label: {
                  position: 'start',
                  formatter: 'Max',
                },
                type: 'max',
                name: '最高点',
              },
            ],
          ],
        },
      },
    ],
  })
  const initChart = () => {
    // 折线图初始化
    const lineChart = echarts.init(lineRef.value)
    lineChart.resize({ width: '500px', height: '280px' })
    lineChart.setOption(lineOptions.value)
  }
  onMounted(() => {
    initChart()
  })
</script>

<template>
  <div class="echarts_line" ref="lineRef"></div>
</template>

<style lang="scss" scoped>
  .echarts_line {
    width: 500px;
    height: 230px;
    margin-top: -30px;
  }
</style>
