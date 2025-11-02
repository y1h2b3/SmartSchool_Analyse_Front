<script lang="ts" setup>
  import { onMounted, getCurrentInstance } from 'vue'
  const props = defineProps(['navIndex'])
  const instance = getCurrentInstance()

  const setNavIndex = (val) => {
    instance.emit('update-navIndex', val)
  }
  onMounted(() => {
    console.log(props.navIndex)
  })
</script>

<template>
  <div class="content">
    <el-scrollbar max-height="650px" class="el-scrollbar">
      <div
        class="el-scrollbar-item"
        :class="{ 'el-scrollbar-item-active': props.navIndex == 0 }"
        @click="setNavIndex(0)"
      >
        <el-icon>
          <Plus />
        </el-icon>
        <span>写通知</span>
      </div>
      <div
        class="el-scrollbar-item"
        :class="{ 'el-scrollbar-item-active': props.navIndex == 1 || props.navIndex === 2 }"
        @click="setNavIndex(1)"
      >
        <el-icon>
          <Plus />
        </el-icon>
        <span>收通知</span>
        <!-- <el-badge :value="12">
          <span>收通知</span>
        </el-badge> -->
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    width: 200px;
    height: 100%;
    margin-right: 14px;
    background-color: #fff !important;
    .el-scrollbar {
      width: 100%;
      padding: 5px 10px;
      box-sizing: border-box;
      cursor: pointer;
      .el-scrollbar-item {
        padding: 0 10px;
        box-sizing: border-box;
        height: 35px;
        color: #000;
        background-color: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        ::v-deep(.el-icon) {
          margin-right: 8px;
        }
        ::v-deep(.el-badge) {
          --el-badge-bg-color: var(--el-color-danger);
          --el-badge-radius: 10px;
          --el-badge-font-size: 8px;
          --el-badge-padding: 3px;
          --el-badge-size: 12px;
          position: relative;
          vertical-align: middle;
          display: inline-block;
        }
      }
      .el-scrollbar-item-active {
        background-color: #419aff !important;
        color: #fff;
        transition: all 0.4s;
      }
    }
  }
</style>
