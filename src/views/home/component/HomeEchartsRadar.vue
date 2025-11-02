<script setup>
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'
  const radarRef = ref(HTMLElement | null)
  const radarOptions = ref({
    color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
    radar: [
      {
        indicator: [
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
          { text: '' },
        ],
        center: ['50%', '50%'],
        radius: 120,
        startAngle: 90,
        splitNumber: 4,
        shape: 'circle',
        axisName: {
          formatter: '{value}',
          color: '#428BD4',
        },
        splitArea: {
          areaStyle: {
            color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 10,
          },
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)',
          },
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(211, 253, 250, 0.8)',
          },
        },
      },
    ],
    series: [
      {
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4,
          },
        },
        data: [
          {
            value: [100, 8, 0.4, -80, 2000, 200],
            name: 'Data A',
          },
          {
            value: [60, 5, 0.3, -100, 1500, 20],
            name: 'Data B',
            areaStyle: {
              color: 'rgba(255, 228, 52, 0.6)',
            },
          },
        ],
      },
    ],
  })
  const initChart = () => {
    // 雷达图初始化
    const radarChart = echarts.init(radarRef.value)
    radarChart.setOption(radarOptions.value)
  }
  onMounted(() => {
    initChart()
  })
</script>

<template>
  <div class="echarts_box">
    <div class="motionItme" style="top: 10px">
      <div class="project">跑步</div>
      <div class="recommend">适合跑步</div>
    </div>
    <div class="motionItme" style="top: 85px; left: 60px">
      <div class="project">滑雪</div>
      <div class="recommend">极不适应</div>
    </div>
    <div class="motionItme" style="top: 245px; left: 60px">
      <div class="project">滑板</div>
      <div class="recommend">一般适宜</div>
    </div>
    <div class="motionItme" style="bottom: 10px">
      <div class="project">网球</div>
      <div class="recommend">一般适宜</div>
    </div>
    <div class="motionItme" style="top: 245px; right: 60px">
      <div class="project">高尔夫</div>
      <div class="recommend">可以进行</div>
    </div>
    <div class="motionItme" style="top: 85px; right: 60px">
      <div class="project">骑自行车</div>
      <div class="recommend">一般适宜</div>
    </div>
    <div class="echarts_radar" ref="radarRef"></div>
  </div>
</template>

<style lang="scss" scoped>
  .echarts_box {
    width: 500px;
    height: 380px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .motionItme {
      width: 90px;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      z-index: 100;
      .project {
        font-size: 13px;
        color: #b7b7b7;
        margin-bottom: 3px;
      }
      .recommend {
        font-size: 15px;
        font-weight: bold;
      }
    }
    .echarts_radar {
      width: 250px;
      height: 250px;
    }
  }
</style>
