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
const total = {
  name: '发烧人数占比',
}
const option = {
  title: [
    {
      text: total.name,
      left: '47%',
      top: '38%',
      textAlign: 'center',
      textBaseline: 'middle',
      textStyle: {
        color: '#fff',
        fontWeight: 'normal',
        fontSize: 14,
      },
    },
  ],
  tooltip: {
    trigger: 'item',
    // formatter: '{a} <br/>{b} : {c} ({d}%)',
  },

  color: ['#4f9de7', '#4acf79'],
  legend: {
    orient: 'vertical',
    x: 'center',
    bottom: '5%',
    selectedMode: false,
    formatter: function (name) {
      var oa = option.series[0].data
      var num = oa[0].value + oa[1].value
      for (var i = 0; i < option.series[0].data.length; i++) {
        if (name == oa[i].name) {
          return name + '  ' + oa[i].value + '%'
        }
      }
    },
    // data: ['test1', 'test2'],
    show: true,
    textStyle: {
      color: '#fff',
      fontWeight: 'bold',
    },
  },
  series: [
    {
      type: 'pie',
      selectedMode: 'single',
      radius: ['45%', '55%'],
      center: ['50%', '40%'],
      data: [],
      label: {
        normal: {
          show: false,
          position: 'outer',
          align: 'left',
          textStyle: {
            rotate: true,
          },
        },
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        normal: {
          label: {
            show: true,
            formatter: '{b} {c}',
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
const fashao = async () => {
  await request({
    // url: '/FindStudentFever',
    url: prop.url,
  }).then((res) => {
    chart.hideLoading()
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
  fashao()
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
