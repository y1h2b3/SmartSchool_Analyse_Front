<script type="ts" setup>
  import { onMounted, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  import request from '@/utils/request.ts'
  const data = [23,41,107];
  var option = {
    grid: {
      left: '2%',
      right: '8%',
      top: '5%',
      bottom: '0%',
      containLabel: true // 是否包含坐标轴的刻度标签
    },
    xAxis: {
      max: 'dataMax'
    },
    yAxis: {
      type: 'category',
      data: ['高','中','低'],
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        realtimeSort: true,
        type: 'bar',
        data: data,
        barWidth: '50%',
        label: {
          show: true,
          position: 'right',
          valueAnimation: true
        }
      }
    ],
    legend: {
      show: true
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
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
      chartInstance.setOption(option)
    // chartInstance.showLoading('default',{
    //         text:'正在加载中...',
    //   textColor:'#6E7079',
    //   fontSize:14,
    // })
  }
  const gradedata=async()=>{
        await request({
      url:'/findAllStudentRank'
    }).then((res)=>{
      chartInstance.hideLoading()
      console.log(res)
      res.map((item,index)=>{
        console.log(item)
        data.push(item.count)
        option.yAxis.data.push(item.level)
      })
      chartInstance.setOption(option)
    })
  }
  onMounted(() => {
    inItEchart()
    // gradedata()
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
