<template>
  <div ref="chartsRef" class="echarts" />
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import { onMounted, ref } from 'vue'
import request from '@/utils/request.ts'
import { de } from 'element-plus/es/locale'
const chartsRef = ref<HTMLElement | null>()
const day = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const option = {
  title: {
    text: '',
    x: 'center',
    y: 'top',
    textStyle: {
      color: '#fff',
      fontSize: 13,
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '8%',
    right: '8%',
    bottom: '5%',
    top: '13%',
    containLabel: true,
  },
  color: ['#72b332', '#35a9e0'],
  legend: {
    show: true,

    right: '15%',
    y: '0',
    textStyle: {
      color: '#999',
      fontSize: '13',
    },
  },
  toolbox: {
    show: false,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  calculable: true,
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#2d3b53',
        },
      },
      axisLabel: {
        textStyle: {
          color: '#fff',
        },
        alignWithLabel: true,
        interval: 0,
        rotate: '15',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#2d3b53',
        },
      },
      axisLabel: {
        textStyle: {
          color: '#999',
        },
      },
    },
  ],
  series: [
    {
      name: null,
      type: 'line',
      smooth: true,
      symbol: 'roundRect',
      data: [],
    },
    {
      name: null,
      type: 'line',
      smooth: true,
      symbol: 'roundRect',
      data: [],
    },
  ],
}
const prop = defineProps({
  nanshenurl: String,
  nushenurl: String,
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
} //男生数据
const nanshenshuimian = async () => {
  //末完成的代码
  await request({
    // url: '/FindStudentMSleepReach',
    url: prop.nanshenurl,
  }).then((res) => {
    chart.hideLoading()
    console.log(Object.values(res[0]))
    option.series[0].data = Object.values(res[0])
    option.xAxis[0].data = day
    option.series[0].name = '男生'
    option.series[1].name = '女生'
    console.log(option.series[0].data)
    chart.setOption(option)
  })
}
//女生数据
const nushenshuimian = async () => {
  await request({
    // url: '/FindStudentFSleepReach',
    url: prop.nushenurl,
  }).then((res) => {
    chart.hideLoading()
    option.series[1].data = Object.values(res[0])
    option.xAxis[0].data = day
    option.series[0].name = '男生'
    option.series[1].name = '女生'
    chart.setOption(option)
  })
}
onMounted(() => {
  chart = initChart()
  nanshenshuimian()
  nushenshuimian()
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
