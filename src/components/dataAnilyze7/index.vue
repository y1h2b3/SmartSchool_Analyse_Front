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
    // formatter: '{b}</br>{a}: {c}</br>{a1}: {c1}',
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
    // data: ['', ''],
    show: false,
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
      type: 'bar',
      data: [],
      boundaryGap: '45%',
      barWidth: '40%',

      itemStyle: {
        normal: {
          color: function (params) {
            var colorList = [
              '#6bc0fb',
              '#7fec9d',
              '#fedd8b',
              '#ffa597',
              '#84e4dd',
              '#f9c940',
              '#f08080',
              '#87cefa',
              '#ff7f50',
              '#da70d6',
              '#90ee90',
              '#4682b4',
            ]
            return colorList[params.dataIndex]
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
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
const avgbushu = async () => {
  await request({
    // url: '/FindStudentEveryMonthAvgStep',
    url: prop.url,
  }).then((res) => {
    chart.hideLoading()
    console.log(res)
    //根据键值对重新排序再赋值
    // option.series[0].data = Object.keys(res)
    //   .sort()
    //   .map((item) => {
    //     return res[item]
    //   })
    option.series[0].data=[8025,7921,8051,6955,5093,6036,9954,3857,6050,7817,8085,5978]
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
  avgbushu()
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
