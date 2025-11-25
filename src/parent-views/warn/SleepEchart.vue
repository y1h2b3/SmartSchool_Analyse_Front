<script type="ts" setup>
  import { onMounted, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        var tar = params[1];
        return '<strong>' + tar.name + '</strong>' + ' : ' + tar.value / 100 + '小时';
      }
    },
    grid: {
      top: '5%',
      left: '2%',
      right: '0%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 800,
      interval: 200,
      axisLabel: {
      formatter: function (value, index) {
        // 自定义每个刻度的标签
        var customLabels = ['00:00', '02:00', '04:00', '06:00', '08:00'];
        return customLabels[index];
      }
    }
    },
    series: [
      {
        name: 'Placeholder',
        type: 'bar',
        stack: 'Total',
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent'
        },
        emphasis: {
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          }
        },
        data: [0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: 'Life Cost',
        type: 'bar',
        stack: 'Total',
        label: {
          show: false,
          position: 'inside'
        },
        itemStyle: {
          color: '#67c1c1'
        },
        barGap: '80%', // 设置柱状图之间的间距为100%
        barCategoryGap: '50%', // 设置柱状图类目（x 轴）之间的间距为50%
        data: [660, 550, 600, 650, 500, 700, 750]
      }
    ]
  }
  watch(
    () => SettingStore.isCollapse,
    () => {
      setTimeout(() => {
        inItEchart()
      }, 200)
    },
  )
  var chartInstance = null
  const inItEchart = () => {
    if (chartInstance) chartInstance.dispose()
    chartInstance = echarts.init(document.querySelector('.my-echart-box'))
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="my-echart-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .my-echart-box {
    width: 460px;
    height: 255px;
  }
</style>
