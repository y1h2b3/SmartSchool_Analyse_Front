<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { getAllStudentInfo } from '@/api/admin/personnelManagement/student.ts'
  import StudentSide from './component/studentSide.vue'
  import StudentTable from './component/studentTable.vue'
  const currentParentNode = ref('小学一年级') // 当前年级数据
  const currentChildrenNode = ref('一年级1班') // 当前班级数据
  const allFreshData = ref(false)
  const updateAllFreshData = (val) => {
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
    const resp = await getAllStudentInfo()
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
    getGradeAndClazzFirst()
  })
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <StudentSide
        @updateCurrentParentNode="updateCurrentParentNode"
        @updateCurrentChildrenNode="updateCurrentChildrenNode"
        :allFreshData="allFreshData"
      ></StudentSide>
      <StudentTable
        :currentParentNode="currentParentNode"
        :currentChildrenNode="currentChildrenNode"
        :allFreshData="allFreshData"
        @updateAllFreshData="updateAllFreshData"
      ></StudentTable>
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
