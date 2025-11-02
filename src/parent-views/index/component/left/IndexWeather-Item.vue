<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue'
  import { useSettingStore } from '@/store/modules/setting'
  import * as echarts from 'echarts'
  const SettingStore = useSettingStore()
  const echartRef = ref<HTMLElement>(null)
  var weatherName = ['小雨', '小雨', '阴', '小雨', '多云', '小雨', '小雨']
  var option = {
    grid: {
      show: true,
      backgroundColor: 'transparent',
      opacity: 0.3,
      borderWidth: '0',
      top: '180',
      bottom: '0',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      show: false,
    },
    dataZoom: [
      {
        type: 'inside',
        show: true,
        xAxisIndex: [0, 1, 2],
        start: 0,
        end: 100,
        filterMode: 'empty',
        // 添加 zoomLock 属性来锁定左侧
        zoomLock: true,
      },
    ],
    xAxis: [
      // 日期
      {
        type: 'category',
        boundaryGap: false,
        position: 'top',
        offset: 130,
        zlevel: 100,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          formatter: ['{a|{value}}'].join('\n'),
          rich: {
            a: {
              color: 'white',
              fontSize: 18,
            },
          },
        },
        nameTextStyle: {},
        data: ['25日', '26日', '27日', '28日', '29日'],
      },
      // 星期
      {
        type: 'category',
        boundaryGap: false,
        position: 'top',
        offset: 110,
        zlevel: 100,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          formatter: ['{a|{value}}'].join('\n'),
          rich: {
            a: {
              color: 'white',
              fontSize: 12,
            },
          },
        },
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 19,
        },
        data: ['周一', '周二', '周三', '周四', '周五'],
      },
      // 天气图标
      {
        type: 'category',
        boundaryGap: false,
        position: 'top',
        offset: 20,
        zlevel: 100,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          formatter: function (value, index) {
            //return '{' + index + '| }\n{b|' + value + '}'
            return '{' + value + '| }\n{b|' + weatherName[value] + '}'
          },
          rich: {
            0: {
              backgroundColor: {
                // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[0]] + '.png')
                image: 'https://d.scggqx.com/forecast/img/小雨.png',
              },
              height: 40,
              width: 40,
            },
            1: {
              backgroundColor: {
                // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[1]] + '.png')
                image: 'https://d.scggqx.com/forecast/img/小雨.png',
              },
              height: 40,
              width: 40,
            },
            2: {
              backgroundColor: {
                // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[2]] + '.png')
                image: 'https://d.scggqx.com/forecast/img/阴.png',
              },
              height: 40,
              width: 40,
            },
            3: {
              backgroundColor: {
                // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[3]] + '.png')
                image: 'https://d.scggqx.com/forecast/img/小雨.png',
              },
              height: 40,
              width: 40,
            },
            4: {
              backgroundColor: {
                // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[4]] + '.png')
                image: 'https://d.scggqx.com/forecast/img/多云.png',
              },
              height: 40,
              width: 40,
            },
            5: {
              backgroundColor: {
                // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[5]] + '.png')
                image: 'https://d.scggqx.com/forecast/img/小雨.png',
              },
              height: 40,
              width: 40,
            },
            6: {
              backgroundColor: {
                // image: require('@/assets/weather_icon/' + this.weatherIconDic[this.weatherdata.weather[6]] + '.png')
                image: 'https://d.scggqx.com/forecast/img/小雨.png',
              },
              height: 40,
              width: 40,
            },
            b: {
              color: 'white',
              fontSize: 12,
              lineHeight: 30,
              height: 20,
            },
          },
        },
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 19,
        },
        // data: this.weatherdata.weather
        //data: ["小雨","小雨","阴","小雨","多云","小雨","小雨"]
        data: [0, 1, 2, 3, 4],
      },
    ],
    yAxis: {
      type: 'value',
      show: false,
      axisLabel: {
        formatter: '{value} °C',
        color: 'white',
      },
    },
    series: [
      {
        name: '最高气温',
        type: 'line',
        data: ['16.3', '16.2', '17.6', '14.2', '17.6'],
        symbol: 'emptyCircle',
        symbolSize: 10,
        showSymbol: true,
        smooth: true,
        itemStyle: {
          normal: {
            color: '#C95843',
          },
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c} °C',
        },
        lineStyle: {
          width: 1,
        },
        areaStyle: {
          opacity: 1,
          color: 'transparent',
        },
      },
      {
        name: '最低气温',
        type: 'line',
        data: ['13.4', '12.8', '13.5', '12.5', '12.4'],
        symbol: 'emptyCircle',
        symbolSize: 10,
        showSymbol: true,
        smooth: true,
        itemStyle: {
          normal: {
            color: 'blue',
          },
        },
        label: {
          show: true,
          position: 'bottom',
          color: 'white',
          formatter: '{c} °C',
        },
        lineStyle: {
          width: 1,
          color: 'white',
        },
        areaStyle: {
          opacity: 1,
          color: 'transparent',
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
    chartInstance = echarts.init(echartRef.value)
    chartInstance.setOption(option)
  }
  onMounted(() => {
    inItEchart()
  })
</script>

<template>
  <div class="weather-content">
    <div class="echart-box" ref="echartRef"></div>
  </div>
</template>

<style lang="scss" scoped>
  .weather-content {
    width: 100%;
    padding: 0px;
    height: 240px;
    // background-color: #39a1c1;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    .echart-box {
      width: 100%;
      height: 250px;
      overflow: hidden;
    }
  }
</style>
