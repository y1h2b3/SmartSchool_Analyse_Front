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
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  color: ['#eaff00', '#22ac38'],
  legend: {
    top: '-2%',
    right: '0',
    // data: ['test1', 'test2'],
    textStyle: {
      color: '#00ffff',
    },
  },
  grid: {
    left: '11%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        color: '#1e2b43',
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
  dataZoom: [
    {
      type: '',
      yAxisIndex: 0,
      filterMode: 'empty',
      start: 0,
      x: '0',
      end: 60,
      handleStyle: {
        color: '#519cff',
        backgroundColor: '#519cff',
      },
      textStyle: {
        color: '#fff',
      },
      borderColor: '#519cff',
    },
  ],
  yAxis: {
    type: 'category',
    data: [],
    splitLine: {
      show: false,
      lineStyle: {
        color: '#1e2b43',
      },
    },

    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#115372',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#419aff',
      },
      lineStyle: {
        color: '#519cff',
      },
      alignWithLabel: true,
      interval: 0,
    },
  },
  series: [
    {
      name: '男生',
      type: 'bar',
      stack: '比例',
      label: {
        normal: {
          show: true,
          position: 'insideRight',
          textStyle: {
            color: '#333',
          },
        },
      },
      data: [],
    },
    {
      name: '女生',
      type: 'bar',
      stack: '比例',
      label: {
        normal: {
          show: true,
          position: 'right',
          textStyle: {
            color: '#00f0ff',
          },
        },
      },
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
}
//女生数据
const nushenyujing = async () => {
  await request({
    // url: '/FindStudentFEveryWeekWarning',
    url: prop.nushenurl,
  }).then((res) => {
    console.log(Object.values(res))
    // option.series[0].data = Object.values(res)
    // option.yAxis.data = Object.keys(res)
    option.series[0].data=[93,87,134,263,310,287,308,401,210,293,264,220,138,148,115]
    option.yAxis.data=['第1周','第2周','第3周','第4周','第5周','第6周','第7周','第8周','第9周','第10周','第11周','第12周','第13周','第14周','第15周']
    chart.setOption(option)
  })
}
const nanshenyujing = async () => {
  await request({
    // url: '/FindStudentMEveryWeekWarning',
    url: prop.nanshenurl,
  }).then((res) => {
    chart.hideLoading()
    // option.series[1].data = Object.values(res)
    // option.yAxis.data = Object.keys(res)
    option.series[1].data=[99,120,300,250,405,520,245,98,246,224,251,410,423,158,137]
    option.yAxis.data=['第1周','第2周','第3周','第4周','第5周','第6周','第7周','第8周','第9周','第10周','第11周','第12周','第13周','第14周','第15周']
    option.series[0].name = '男生'
    option.series[1].name = '女生'
    chart.setOption(option)
  })
}
onMounted(() => {
  chart = initChart()
  nushenyujing()
  nanshenyujing()
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
