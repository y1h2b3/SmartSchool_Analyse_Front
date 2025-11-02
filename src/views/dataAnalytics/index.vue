<template>
  <div class="data-container">
    <div class="constant_header">
      <div class="header">
        健康监测与数据分析
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
              <Graph width="100%" height="100%" />
            </div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
          <div class="border-container">
            <div class="name-title"> 学生一周睡眠时间达标人数 </div>
            <div id="graduateyear">
              <Graph1 width="100%" height="100%" />
            </div>
            <ul class="three-pie clearfix">
              <li>
<!--                <span class="name-title"> 各年级心率分布</span>-->
                <div id="sexrate">
                  <Graph2 width="100%" height="100%" />
                </div>
              </li>
              <li>
<!--                <span class="name-title">各年龄段心率分布</span>-->
                <div id="householdrate">
                  <Graph3 width="100%" height="100%" />
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
              <Graph9 width="100%" height="100%" />
            </div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
          <div class="border-container">
            <ul class="teacher-pie clearfix">
              <li>
                <div class="name-title"> 年龄段平均步数分布 </div>
                <div id="courserate">
                  <Graph4 width="100%" height="100%" />
                </div>
              </li>
              <li>
                <div class="name-title">BIM体脂分布</div>
                <div id="professionrate">
                  <Graph5 width="100%" height="100%" />
                </div>
              </li>
            </ul>
            <div class="name-title" style="position: relative;top: 10px;"> 学生每个月平均步数 </div>
            <div id="changedetail">
              <Graph6 width="100%" height="100%" />
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
                  <th>运动</th>
                  <th>睡眠</th>
                  <th>心率</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>高一(1班</td>
                  <td>14</td>
                  <td>23</td>
                  <td>25</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>高二(1)班</td>
                  <td>15</td>
                  <td>21</td>
                  <td>32</td>
                  <td>28</td>
                </tr>
                <tr>
                  <td>高二(2)班</td>
                  <td>23</td>
                  <td>25</td>
                  <td>38</td>
                  <td>26</td>
                </tr>
                <tr>
                  <td>高三(4)班</td>
                  <td>22</td>
                  <td>24</td>
                  <td>31</td>
                  <td>29</td>
                </tr>
                <tr>
                  <td>高三(5)班</td>
                  <td>24</td>
                  <td>22</td>
                  <td>38</td>
                  <td>26</td>
                </tr>
                <tr>
                  <td>高三(3)班</td>
                  <td>24</td>
                  <td>25</td>
                  <td>38</td>
                  <td>22</td>
                </tr>
                <tr>
                  <td>高一(5)班</td>
                  <td>26</td>
                  <td>21</td>
                  <td>34</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>高一(4)班</td>
                  <td>26</td>
                  <td>21</td>
                  <td>34</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>高二(5)班</td>
                  <td>26</td>
                  <td>21</td>
                  <td>34</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>高一(3)班</td>
                  <td>26</td>
                  <td>21</td>
                  <td>34</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>高二(4)班</td>
                  <td>26</td>
                  <td>21</td>
                  <td>34</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td>高二(5)班</td>
                  <td>28</td>
                  <td>12</td>
                  <td>42</td>
                  <td>36</td>
                </tr>
                <tr>
                  <td>高一(2)班</td>
                  <td>26</td>
                  <td>22</td>
                  <td>32</td>
                  <td>26</td>
                </tr>
              </tbody>
            </table>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
          <div class="border-container">
            <div class="name-title"> 每日预警人数 </div>
            <div id="juniorservice">
              <Graph7 width="100%" height="100%" />
            </div>
            <span class="top-left border-span"></span>
            <span class="top-right border-span"></span>
            <span class="bottom-left border-span"></span>
            <span class="bottom-right border-span"></span>
          </div>
          <div class="border-container">
            <div class="name-title"> 学生每个月发烧人数 </div>
            <div id="edubalance">
              <Graph8 width="100%" height="100%" />
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

  const timeDate = ref()
  const hourTime = ref()
  const time1 = ref()
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
  onMounted(() => {

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
