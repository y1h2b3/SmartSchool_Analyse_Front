<script lang="ts" setup>
  import { ref } from 'vue'
  import TopEchart1 from './TopEchart1.vue'
  import TopEchart2 from './TopEchart2.vue'
  import TopEchart3 from './TopEchart3.vue'
  /* import TopEchart4 from './TopEchart4.vue'
  import TopEchart5 from './TopEchart5.vue' */
  const tableList = ref([{ clazz: '普通教师' }, { clazz: '班主任' }, { clazz: '教务处' }])
  const isChange = ref<boolean>(false)
  const changeCarousel = () => {
    isChange.value = !isChange.value
  }
</script>

<template>
  <div class="one-box">
    <el-carousel height="200px" direction="vertical" motion-blur autoplay @change="changeCarousel">
      <el-carousel-item v-for="(item, index) in tableList" :key="item.clazz">
        <div class="header">
          <h5>职位：</h5>
          <span>{{ item.clazz }}</span>
        </div>
        <TopEchart1 v-if="index == 0" :clazz="tableList[0]" :isChange="isChange"></TopEchart1>
        <TopEchart2 v-else-if="index == 1" :clazz="tableList[1]" :isChange="isChange"></TopEchart2>
        <TopEchart3 v-else-if="index == 2" :clazz="tableList[2]" :isChange="isChange"></TopEchart3>
        <!-- <TopEchart4 v-else-if="index == 3" :clazz="tableList[3]" :isChange="isChange"></TopEchart4>
        <TopEchart5 v-else-if="index == 4" :clazz="tableList[4]" :isChange="isChange"></TopEchart5> -->
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style lang="scss" scoped>
  .one-box {
    width: 100%;
    height: 200px;
    box-sizing: border-box;
    border-radius: 20px 5px 5px 5px;
    border: 1px solid #f0f2f5;
    .el-carousel__item {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
      .header {
        display: flex;
        h5 {
          margin: 0;
        }
        span {
          font-size: 13px;
        }
      }
    }
    ::v-deep(.el-carousel__button) {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
</style>
