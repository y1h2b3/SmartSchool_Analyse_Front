<script type="ts" setup>
  import { onMounted, watch, ref } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  import request from '@/utils/request.ts'
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '<strong>{b}</strong> : {c} ({d}%)'
    },
    legend: {
      left: 'center',
      top: 'bottom',
      data: []
    },
    series: [
      {
        type: 'pie',
        radius: [10, 70],
        center: ['50%', '50%'],
        roseType: 'area',
        startAngle: 90,
        endAngle: 360,
        clockwise: true, // 逆时针绘制饼图
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [
          // { value: 80, name: '不良饮食习惯' },
          // { value: 52, name: '缺乏运动' },
          // { value: 124, name: '不良睡眠习惯' },
          // { value: 24, name: '应对压力不当' },
          // { value: 10, name: '基因和遗传因素' },
          // { value: 21, name: '不良的情绪和心理健康状态' },
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
    chartInstance = echarts.init(document.querySelector('.grade-echart-box'))
    // chartInstance.setOption(option)
        chartInstance.showLoading('default',{
      text:'正在加载中...',
      textColor:'#6E7079',
      fontSize:14,
    })
  }
  const gradedata=async()=>{
    await request({
      url:'/findAllStudentWarning'
    }).then((res)=>{
      chartInstance.hideLoading()
      res = res.slice(3)
      res.map((item)=>{
        console.log(item)
        option.series[0].data=res.map((item)=>{
          return{
            value: item.number,
            name: item.type,
          }
        })
      })
      console.log(option.series.data)
      chartInstance.setOption(option)
    })
  }
  onMounted(() => {
    inItEchart()
    gradedata()
    // 90 320 220 160
  })
</script>

<template>
  <div class="grade-echart-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .grade-echart-box {
    width: 100%;
    height: 200px;
  }
</style>
