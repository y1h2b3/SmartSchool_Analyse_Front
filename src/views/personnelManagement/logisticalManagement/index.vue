<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { getAllLogisticalInfo } from '@/api/admin/personnelManagement/logistical.ts'
  import LogisticalSide from './component/logisticalSide.vue'
  import LogisticalTable from './component/logisticalTable.vue'
  const currentParentNode = ref('职位') // 当前年级数据
  const currentChildrenNode = ref(null) // 当前班级数据
  const allFreshData = ref(false)
  const updateAllFreshData = () => {
    allFreshData.value = !allFreshData.value
  }
  const updateCurrentParentNode = (val) => {
    currentParentNode.value = val
  }
  const updateCurrentChildrenNode = (val) => {
    currentChildrenNode.value = val
  }
  onMounted(async () => {
    const resp = await getAllLogisticalInfo()
    resp.map((item) => {
      if (currentChildrenNode.value === '') {
        currentChildrenNode.value = item.post
      }
    })
  })
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <LogisticalSide
        @updateCurrentParentNode="updateCurrentParentNode"
        @updateCurrentChildrenNode="updateCurrentChildrenNode"
        :allFreshData="allFreshData"
      ></LogisticalSide>
      <LogisticalTable
        :currentParentNode="currentParentNode"
        :currentChildrenNode="currentChildrenNode"
        @updateAllFreshData="updateAllFreshData"
      ></LogisticalTable>
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
