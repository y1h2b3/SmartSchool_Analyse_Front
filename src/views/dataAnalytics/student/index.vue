<template>
  <div class="data-container">
    <div class="constant_header">
      <div class="header">
        学生健康监测与数据分析
        <a href="javascript:;" class="a-access">
          <button class="button type1" @click="$router.push('/')"> 返回 </button>
        </a>
      </div>
      <!--主体-->
      <div class="main clearfix">
        <div class="main-left">
          <div class="border-container">
            <div class="name-title"> 学生健康平均指标 </div>
            <div id="radar">
              <Graph width="100%" height="100%" url="/FindAvgStudentBodyIndex" />
            </div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
          <div class="border-container">
            <div class="name-title"> 学生一周睡眠时间达标人数 </div>
            <div id="graduateyear">
              <Graph1
                width="100%"
                height="100%"
                nanshenurl="/FindStudentMSleepReach"
                nushenurl="/FindStudentFSleepReach"
              />
            </div>
            <ul class="three-pie clearfix">
              <li>
                <!--                <span class="name-title"> 各年级心率分布</span>-->
                <div id="sexrate">
                  <Graph2 width="100%" height="100%" url="/FindStudentMotion" />
                </div>
              </li>
              <li>
                <!--                <span class="name-title">各年龄段心率分布</span>-->
                <div id="householdrate">
                  <Graph3 width="100%" height="100%" url="/FindStudentFever" />
                </div>
              </li>
            </ul>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
        </div>
        <div class="main-middle">
          <div class="border-container">
            <div class="name-title"> 每月运动达标人数 </div>
            <div id="mapadd">
              <Graph9 width="100%" height="100%" url="/FindStudentSportsReach" />
            </div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
          <div class="border-container">
            <ul class="teacher-pie clearfix">
              <li>
                <div class="name-title">当月年龄段平均步数分布 </div>
                <div id="courserate">
                  <Graph4 width="100%" height="100%" url="/FindStudentAvgStepByAge" />
                </div>
              </li>
              <li>
                <div class="name-title">肥胖率分布占比</div>
                <div id="professionrate">
                  <Graph5 width="100%" height="100%" url="/FindStudentFatPercentage" />
                </div>
              </li>
            </ul>
            <div class="name-title" style="position: relative; top: 10px"> 学生每个月平均步数 </div>
            <div id="changedetail">
              <Graph6 width="100%" height="100%" url="/FindStudentEveryMonthAvgStep" />
            </div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
        </div>
        <div class="main-right">
          <div class="border-container">
            <div class="name-title"> 每月班级异常人数排行榜 </div>
            <table class="table table-kingdargen">
              <thead>
                <tr>
                  <th>班级</th>
                  <th>BIM</th>
                  <th>血氧</th>
                  <th>睡眠</th>
                  <th>心率</th>
                </tr>
              </thead>
              <tbody v-if="getData.length > 0">
                <tr v-for="item in getData" :key="item.id">
                  <td>{{ item.type }}</td>
                  <td>{{ item.bim }}</td>
                  <td>{{ item.spo2 }}</td>
                  <td>{{ item.sleep }}</td>
                  <td>{{ item.heart }}</td>
                </tr>
              </tbody>
              <div v-else class="no-data">暂无数据</div>
            </table>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
          <div class="border-container">
            <div class="name-title"> 每日预警人数 </div>
            <div id="juniorservice">
              <Graph7
                width="100%"
                height="100%"
                nanshenurl="/FindStudentMEveryWeekWarning"
                nushenurl="/FindStudentFEveryWeekWarning"
              />
            </div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
          <div class="border-container">
            <div class="name-title"> 学生每个月发烧人数 </div>
            <div id="edubalance">
              <Graph8
                width="100%"
                height="100%"
                nanshenurl="/FindStudentMEveryFeverSum"
                nushenurl="/FindStudentFEveryFeverSum"
              />
            </div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Graph from '@/components/dataAnilyze1/index.vue'
import Graph1 from '@/components/dataAnilyze2/index.vue'
import Graph2 from '@/components/dataAnilyze3/index.vue'
import Graph3 from '@/components/dataAnilyze4/index.vue'
import Graph4 from '@/components/dataAnilyze5/index.vue'
import Graph5 from '@/components/dataAnilyze6/index.vue'
import Graph6 from '@/components/dataAnilyze7/index.vue'
import Graph7 from '@/components/dataAnilyze8/index.vue'
import Graph8 from '@/components/dataAnilyze9/index.vue'
import Graph9 from '@/components/dataAnilyze10/index.vue'
import request from '@/utils/request.ts'

const timeDate = ref()
const hourTime = ref()
const time1 = ref()
const getData = ref([
  { type: '初一(4)班', bim: 12, spo2: 8, sleep: 20, heart: 4 },
  { type: '高二(1)班', bim: 9, spo2: 4, sleep: 17, heart: 4 },
  { type: '初三(2)班	', bim: 6, spo2: 3, sleep: 14, heart: 3 },
  { type: '高三(7)班', bim: 5, spo2: 3, sleep: 14, heart: 3 },
  { type: '高三(3)班', bim: 2, spo2: 1, sleep: 11, heart: 1 },
])
const getHour = () => {
  let date = new Date()
  let hour = date.getHours().toString().padStart(2, '00')
  let minute = date.getMinutes().toString().padStart(2, '00')
  let second = date.getSeconds().toString().padStart(2, '00')
  hourTime.value = `${hour}:${minute}:${second}`
  time1.value = setTimeout(() => {
    time1.value && clearTimeout(time1.value)
    getHour()
  }, 1000)
}

const getNowTime = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  timeDate.value = `${year}年${month}月${day}日`
  getHour()
}
//异常人员数据
const yichang = async () => {
  await request({
    url: '/FindStudentRankList',
  }).then((res) => {
    console.log(res)
    // getData.value = res
  })
}
onMounted(() => {
  yichang()
  getNowTime()
})
// 返回首页
// const buttonhandle = (res) => {
//   res.$router.push('/')
// }
onBeforeUnmount(() => {
  time1.value = null
})
</script>
<style lang="scss" scoped>
.data-container {
  width: 100%;
  height: 100% !important;
}
@import './index.css';
</style>
