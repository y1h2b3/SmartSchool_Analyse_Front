<script type="ts" setup>
  import { onMounted, watch, ref } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  const SettingStore = useSettingStore()
  import * as echarts from 'echarts'
  import request from '@/utils/request.ts'
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '<strong>{b}</strong> <br/>预警占比：{d}%'
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
        type: 'pie',
        radius: [10, 100],
        center: ['30%', '50%'],
        roseType: 'area',
        startAngle: 90,
        endAngle: 360,
        clockwise: true,
        label: {
          show: false,
        },
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [
          // { value: 12, name: '不良饮食习惯' },
          // { value: 43, name: '缺乏运动' },
          // { value: 73, name: '不良睡眠习惯' },
          // { value: 31, name: '应对压力不当' },
          // { value: 3, name: '基因和遗传因素' },
          // { value: 17, name: '心理健康状态' },
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
    chartInstance = echarts.init(document.querySelector('.my-echart-box'))
    // chartInstance.setOption(option)
    chartInstance.showLoading('default',{
            text:'正在加载中...',
      textColor:'#6E7079',
      fontSize:14,
    })
  }
  const reasondata=async()=>{
        await request({
      url:'/findAllStudentWarning'
    }).then((res)=>{
      chartInstance.hideLoading()
      res = res.slice(3)
      res.map((item)=>{
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
    reasondata()
    // 90 320 220 160
  })
</script>

<template>
  <div class="my-echart-box" ref="echartRef"></div>
</template>

<style lang="scss" scoped>
  .my-echart-box {
    width: 100%;
    height: 200px;
  }
</style>
