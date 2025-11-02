<template>
  <div ref="chartsRef" class="echarts" />
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { EChartsType } from 'echarts/core'
import { onMounted, ref } from 'vue'
import request from '@/utils/request.ts'
const chartsRef = ref<HTMLElement | null>()
const option = {
  tooltip: {
    trigger: 'axis',
    formatter: '{b}</br>{a}: {c}</br>{a1}: {c1}</br>{a2}: {c2}</br>{a3}: {c3}',
  },
  toolbox: {
    show: false,
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  legend: {
    // data: ['test1', 'test2', 'test3', 'test4', 'test5'],
    right: '15%',
    textStyle: {
      color: '#fff',
    },
  },
  grid: {
    top: '18%',
    right: '5%',
    bottom: '8%',
    left: '5%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      splitLine: {
        show: false,
        lineStyle: {
          color: '#3c4452',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#fff',
        },
        lineStyle: {
          color: '#519cff',
        },
        alignWithLabel: true,
        interval: 0,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',

      nameTextStyle: {
        color: '#fff',
      },
      interval: 5,
      max: 50,
      min: 0,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#23303f',
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#115372',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#fff',
        },
        alignWithLabel: true,
        interval: 0,
      },
    },
  ],
  color: 'yellow',
  series: [
    {
      name: null,
      type: 'bar',
      data: [],
      itemStyle: {
        normal: {
          color: '#76da91',
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
      },
    },
    {
      name: null,
      type: 'bar',
      data: [],
      itemStyle: {
        normal: {
          color: '#f8cb7f',
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
      },
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
}
//男生数据
const nanshenfashao = async () => {
  await request({
    // url: '/FindStudentMEveryFeverSum',
    url: prop.nanshenurl,
  }).then((res) => {
    chart.hideLoading()
    // console.log(res)
    // option.series[0].data = Object.keys(res)
    //   .sort()
    //   .map((item) => {
    //     return res[item]
    //   })
    option.series[0].data=[7,10,20,25,34,40,21,22,30,6,3,1]
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
    option.series[0].name = '男生'
    chart.setOption(option)
  })
}
const nushenfashao = async () => {
  await request({
    // url: '/FindStudentFEveryFeverSum',
    url: prop.nushenurl,
  }).then((res) => {
    // console.log(res)
    // option.series[1].data = Object.keys(res)
    //   .sort()
    //   .map((item) => {
    //     return res[item]
    //   })
    option.series[1].data=[10,12,14,20,18,30,25,22,9,5,3,1]
    option.series[1].name = '女生'
    chart.setOption(option)
  })
}
onMounted(() => {
  chart = initChart()
  nanshenfashao()
  nushenfashao()
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
