<template>
  <div ref="chartsRef" class="echarts" />
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import request from '@/utils/request.ts'
import { onMounted, ref } from 'vue'
const chartsRef = ref<HTMLElement | null>()
const option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true,
      },
    },
  ],
  yAxis: [
    {
      // name: '步数',
      type: 'value',
      axisLabel: {
        formatter: '{value} 人',
        color: '#fff',
      },
    },
  ],
  series: [
    {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: [],
      itemStyle: {
        normal: {
          color: function (parms) {
            let colorList = [
              '#2f4554',
              '#c23531',
              '#61a0a8',
              '#d48265',
              '#749f83',
              '#ca8622',
              '#bda29a',
              '#6e7074',
              '#546570',
              '#c4ccd3',
              '#f05b72',
              '#444653',
            ]
            return colorList[parms.dataIndex]
          },
        },
      },
    },
  ],
}
const prop = defineProps({
  url: String,
})
let chart: EChartsType
const initChart = () => {
  const chart = echarts.init(chartsRef.value)
  chart.showLoading('default', {
    maskColor: 'rgba(0, 0, 0, 0.1)', //遮罩层颜色
    text: '努力加载中...', //加载文字提示
    textColor: '#fff', //文字颜色
    fontSize: 14, //文字大小
  })
  // chart.setOption(option)
  return chart
}
//请求数据
const yudongnumber = async () => {
  await request({
    // url: '/FindStudentSportsReach',
    url: prop.url,
    method: 'get',
    params: {},
  }).then((res) => {
    chart.hideLoading()
    console.log(Object.values(res))
    // option.series[0].data = Object.values(res)
    option.series[0].data=[803,691,837,424,698,795,903,523,708,810,791,1007]
    option.xAxis[0].data = [
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
    ]
    chart.setOption(option)
  })
}
onMounted(() => {
  chart = initChart()
  yudongnumber()
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
