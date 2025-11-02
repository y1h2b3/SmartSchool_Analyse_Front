<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  const richHtml = ref(
    '一、增加深睡眠时间，尝试放松身心，建立规律的睡眠时间表。\n二、控制体脂率，增加有氧运动和健康饮食，避免高糖高脂食物。\n三、保持良好的静息心率，可以尝试进行适量的有氧运动来提高心肺功能。\n四、保持步数，继续保持每天的运动量，增加有氧运动时间。\n五、注意饮食均衡，避免过多的油脂摄入，增加蔬果和蛋白质摄入。\n六、定期进行健康检查，关注身体指标的变化，及时调整生活方式。'
  )
  const changeToHtml = (type) => {
    let reg = new RegExp('\\n', 'g')
    let str = type.replace(reg, '<br>')
    return str
  }
</script>

<template>
  <div class="propose-content">
    <span class="title">健康小贴士</span>
    <div class="box" v-html="changeToHtml(richHtml)"></div>
  </div>
</template>

<style lang="scss" scoped>
  .propose-content {
    width: 100%;
    height: 250px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: center;
    .title {
      width: 100%;
      height: 42px;
      padding: 10px;
      border-bottom: 1px solid #e1e1e1;
      box-sizing: border-box;
      font-weight: 700;
    }
    .box {
      width: 100%;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: flex-start;
      padding: 10px 10px 10px 20px;
      box-sizing: border-box;
      font-size: 12px;
      line-height: 25px;
      overflow: hidden;
    }
  }
</style>
