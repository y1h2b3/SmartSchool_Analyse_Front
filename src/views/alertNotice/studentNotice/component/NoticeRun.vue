<script type="ts" setup>
  import { onMounted, watch, ref } from 'vue'
  const props = defineProps(['dialogVisible'])
  import * as echarts from 'echarts'
  const option = {
    title: {
      show: false,
      text: '',
      left: 0,
    },
    tooltip: {
      trigger: 'item',
      formatter: '当前占比({d}%)&nbsp;&nbsp;&nbsp;&nbsp;<br/>{a} : {c}',
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 10,
      align: 'left',
      icon: 'circle',
      data: ['吃饭', '睡觉', '打豆豆', '干饭'],
      textStyle: {
        fontSize: 11,
      }
    },
    series: [
      {
        name: '吃饭',
        type: 'pie',
        radius: ['60%', '70%'],
        roseType: 'area',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: [120, 230, 300, 423]
      },
      {
        name: '睡觉',
        type: 'pie',
        radius: ['60%', '70%'],
        roseType: 'area',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: [200, 200, 200, 200]
      },
      {
        name: '打豆豆',
        type: 'pie',
        radius: '35%',
        // roseType: 'area',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: [200, 200, 200, 200]
      },
      {
        name: '干饭',
        type: 'pie',
        radius: '35%',
        // roseType: 'area',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: [200, 200, 200, 200]
      }
    ]
  }
  watch(
    () => props.dialogVisible,
    () => {
      inItEchart()
    }
  )
  var chartInstance = null
  const inItEchart = () => {
    if (chartInstance) chartInstance.dispose()
    chartInstance = echarts.init(document.querySelector('.run-echart-box'))
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="run-echart-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .run-echart-box {
    width: 370px;
    height: 255px;
  }
</style>
