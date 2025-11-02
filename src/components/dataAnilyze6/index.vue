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
    x: 'center',
    y: 'bottom',
    textStyle: {
      color: '#fff',
    },
    // data: ['test1', 'test2', 'test3'],
    formatter: function (name) {
      var oa = option.series[0].data
      var num = oa[0].value + oa[1].value + oa[2].value
      for (var i = 0; i < option.series[0].data.length; i++) {
        if (name == oa[i].name) {
          return name + ' ' + oa[i].value + '人'
        }
      }
    },
  },
  series: [
    {
      type: 'pie',
      radius: '60%',
      center: ['50%', '36%'],
      data: [
        // { value: 335, name: '正常范围' },
        // { value: 310, name: '轻度肥胖' },
        // { value: 234, name: '中度肥胖' },
      ],
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
            formatter: '  {b}',
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
const feipang = async () => {
  await request({
    // url: '/FindStudentFatPercentage',
    url: prop.url,
  }).then((res) => {
    chart.hideLoading()
    // console.log(res)
    option.series[0].data = Object.keys(res).map((item: any) => {
      return {
        value: Number(res[item]),
        name: item,
      }
    })
    chart.setOption(option)
  })
}
onMounted(() => {
  chart = initChart()
  feipang()
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
