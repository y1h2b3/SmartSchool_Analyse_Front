<script type="ts" setup>
  import { onMounted, watch, ref, computed } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  const props = defineProps(['clazz', 'isChange'])
  import * as echarts from 'echarts'

  const clazzData = ref({
    total: 45,
    warning: 13,
    grade: {
      highAlertCount: 2,
      mediumAlertCount: 4,
      lowAlertCount: 7,
    }
  })

  watch(
    () => props.isChange,
    () => {
      inItEchart()
    }
  )

  const option = {
    title: {
      text: `班级总人数：${clazzData.value.total}人`,
      subtext: `预警人数：${clazzData.value.warning}人`,
      left: 'left',
      padding: [10, 0, 0, 0],
      textStyle: {
        fontSize: 13.5,
      }
    },
    legend: {
      orient: 'none',
      left: 'right',
      textStyle: {
        fontSize: 11,
      }
    },
    series: [
      {
        name: '预警',
        type: 'pie',
        radius: '80%',
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 5
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
            fontWeight: 'bold',
            formatter: '{b}: {c}人 ({d}%)', // 使用 {b} 表示数据项名称（name），{c} 表示数据项值（value），这里显示的格式为：数据项名称: 数据项值人
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: clazzData.value.grade.highAlertCount, name: '高', itemStyle: { normal: { color: '#ee6666' } } }, // 高预警人数的颜色为红色（#ff4500）
          { value: clazzData.value.grade.mediumAlertCount, name: '中', itemStyle: { normal: { color: '#fc8452' } } }, // 中预警人数的颜色为橙色（#ffa500）
          { value: clazzData.value.grade.lowAlertCount, name: '低', itemStyle: { normal: { color: '#fac858' } } }, // 低预警人数的颜色为黄色（#ffd700）
        ]
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
    chartInstance = echarts.init(document.querySelector('.top-echart-box4'))
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="top-echart-box4" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .top-echart-box4 {
    width: 305px;
    height: 170px;
  }
</style>
