<script type="ts" setup>
  import { ref, onMounted, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const props = defineProps(['healthData'])
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  const data = [props.healthData.height, props.healthData.weight, props.healthData.fatPercentage, props.healthData.bmi]
  const color = ['#fa796f', '#54c1fb', '#ca6cd4', '#59dcc1', '#09a4ea', '#e98f4d', '#ea8e49']
  const dataOptions = []
  data.forEach((item, index) => {
    let obj = {
      value: data[index],
      itemStyle: {
        color: '#67C1C1',
      },
    }
    dataOptions.push(obj)
  })
  var option = {
    color,
    grid: {
      top: '5%',
      left: '0%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      borderWidth: 0,
    },
    yAxis: {
      type: 'value',
      // 设置坐标轴的 文字样式
      axisLabel: {
        color: '#6E7079',
        margin: 20, // 刻度标签与轴线之间的距离。
      },
      axisTick: {
        // 取消坐标轴刻度线
        show: false,
      },
      // 坐标轴轴线相关设置。
      splitLine: {
        lineStyle: {
          color: '#E1E1E1',
        },
      },
    },
    xAxis: {
      type: 'category',
      splitLine: {
        show: false,
      },
      // 坐标轴轴线相关设置。
      axisLine: {
        lineStyle: {
          color: '#E1E1E1',
        },
      },
      data: ['身高', '体重', '体脂率', 'BMI'],
      axisLabel: {
        // 设置坐标轴的 文字样式
        color: '#6E7079',
        margin: 20, // 刻度标签与轴线之间的距离。
      },
      axisTick: {
        // 取消坐标轴刻度线
        show: false,
      },
    },
    series: [
      {
        data: dataOptions,
        type: 'bar',
        barMaxWidth: 18,
        markLine: {
          silent: true,
        },
      },
    ],
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
    chartInstance = echarts.init(document.querySelector('.body-target-box'))
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="body-target-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .body-target-box {
    width: 340px;
    height: 200px;
  }
</style>
