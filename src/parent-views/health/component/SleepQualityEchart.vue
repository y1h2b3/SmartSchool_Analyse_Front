<script type="ts" setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const props = defineProps(['healthData'])
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  watch(
    () => SettingStore.isCollapse,
    () => {
      setTimeout(() => {
        inItEchart()
      }, 200)
    },
  )
  // (props.healthData.deepSleepTotal * 60 / (props.healthData.sleepTimeTotal * 60 / 100)).toFixed(1)
  const total = ref(props.healthData.sleepTimeTotal)
  const trafficWay = ref([
    {
      name: '深睡时长',
      // value: 26.57,
      value: (props.healthData.deepSleepTotal * 60 / (total.value * 60 / 100)).toFixed(2),
    },
    {
      name: '浅睡时长',
      // value: 73.42,
      value: (props.healthData.lightSleepTotal * 60 / (total.value * 60 / 100)).toFixed(2),
    },
    {
      name: '清醒时长',
      // value: 1.09,
      value: (props.healthData.wakeTimeTotal * 60 / (total.value * 60 / 100)).toFixed(2),
    },
  ])
  var data = []
  var color = ['#fd566a', '#9787ff', '#fdb36a', '#fdd56a', '#6da7ff', '#63e1f2', '#ff3000']
  for (var i = 0; i < trafficWay.value.length; i++) {
    data.push(
      {
        value: trafficWay.value[i].value,
        name: trafficWay.value[i].name,
        itemStyle: {
          normal: {
            borderWidth: 5,
            borderColor: color[i],
            shadowColor: color[i],
          },
        },
      },
      {
        value: 2,
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0,
          },
        },
      },
    )
  }
  let options = {
    color: color,
    toolbox: {
      show: false,
    },
    legend: {
      orient: 'horizontal',
      left: '70%',
      top: '0%',
      textStyle: {
        fontSize: 11,
      }
    },
    series: {
      type: 'pie',
      clockWise: false,
      radius: [60, 70],
      center: ['30%', '50%'],
      hoverAnimation: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
          formatter: function(params) {
            let name = params.name;
            let value = params.value;
            return `${name}：${(value*4.944/60).toFixed(2)}/h`;
          }
        }
      },
      data: data,
    },
  }
  var chartInstance = null
  const inItEchart = () => {
    if (chartInstance) chartInstance.dispose()
    chartInstance = echarts.init(document.querySelector('.sleep-quality-box'))
    chartInstance.setOption(options)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="sleep-quality-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .sleep-quality-box {
    width: 340px;
    height: 200px;
  }
</style>
