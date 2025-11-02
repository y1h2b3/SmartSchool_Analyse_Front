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
const option = {
  tooltip: {
    trigger: 'item',
    // formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    // orient: 'vertical',
    // right: '0',
    y: 'bottom',
    textStyle: {
      color: '#fff',
    },

    formatter: function (name) {
      var oa = option.series[0].data
      var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value
      for (var i = 0; i < option.series[0].data.length; i++) {
        if (name == oa[i].name) {
          return name + ' ' + oa[i].value + '步'
        }
      }
    },
    // data: ['test1', 'test2', 'test3', 'test4', 'test5', 'text6'],
  },
  series: [
    {
      type: 'pie',
      radius: '45%',
      color: ['#27c2c1', '#9ccb63', '#fcd85a', '#60c1de', '#0084c8'],
      center: ['50%', '37%'],
      data: [],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}',
          },
        },
        labelLine: { show: true },
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
const ageavgbushu = async () => {
  await request({
    // url: '/FindStudentAvgStepByAge',
    url: prop.url,
  }).then((res) => {
    chart.hideLoading()
    option.series[0].data = Object.keys(res).map((item: any) => {
      return {
        value: Math.trunc(res[item]),
        name: item,
      }
    })
    chart.setOption(option)
  })
}
onMounted(() => {
  chart = initChart()
  ageavgbushu()
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
