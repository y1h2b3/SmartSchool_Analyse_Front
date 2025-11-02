<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { getAllParentInfo } from '@/api/admin/personnelManagement/parent.ts'
  import ParentSide from './component/parentSide.vue'
  import ParentTable from './component/parentTable.vue'
  const currentParentNode = ref('') // 当前年级数据
  const currentChildrenNode = ref('') // 当前班级数据
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
  /**
   * 获取年级班级数据
   */
  const getGradeAndClazzFirst = async () => {
    // 获取所有的年级和班级信息
    currentParentNode.value = ''
    currentChildrenNode.value = ''
    const gradeMap = new Map()
    const resp = await getAllParentInfo()
    resp.map((item) => {
      if (!gradeMap.get(item.grade)) {
        if (currentParentNode.value === '') {
          currentParentNode.value = item.grade
        }
        gradeMap.set(item.grade, [])
      }
      if (!gradeMap.get(item.grade).includes(item.clazz)) {
        if (currentChildrenNode.value === '') {
          currentChildrenNode.value = item.clazz
        }
        gradeMap.get(item.grade).push(item.clazz)
      }
    })
  }
  onMounted(() => {
    // getGradeAndClazzFirst()
  })
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <ParentSide
        @updateCurrentParentNode="updateCurrentParentNode"
        @updateCurrentChildrenNode="updateCurrentChildrenNode"
        :allFreshData="allFreshData"
      ></ParentSide>
      <ParentTable
        :currentParentNode="currentParentNode"
        :currentChildrenNode="currentChildrenNode"
        :allFreshData="allFreshData"
        @updateAllFreshData="updateAllFreshData"
      ></ParentTable>
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
