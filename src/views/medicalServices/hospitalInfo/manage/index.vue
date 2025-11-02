<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref } from 'vue'
  import Side from './component/Side.vue'
  import Table from './component/Table.vue'
  const currentParentNode = ref('') // 当前年级数据
  const currentChildrenNode = ref('') // 当前班级数据
  const updateCurrentParentNode = (val) => {
    currentParentNode.value = val
  }
  const updateCurrentChildrenNode = (val) => {
    currentChildrenNode.value = val
  }
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <Side
        @updateCurrentParentNode="updateCurrentParentNode"
        @updateCurrentChildrenNode="updateCurrentChildrenNode"
      ></Side>
      <Table
        :currentParentNode="currentParentNode"
        :currentChildrenNode="currentChildrenNode"
      ></Table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .app-container-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px;
    background-color: #eceef1;
    box-shadow: none;
  }
</style>
