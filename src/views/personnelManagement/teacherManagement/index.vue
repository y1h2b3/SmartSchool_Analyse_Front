<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { getAllTeacherInfo } from '@/api/admin/personnelManagement/teacher.ts'
  import TeacherSide from './component/teacherSide.vue'
  import TeacherTable from './component/teacherTable.vue'
  const currentParentNode = ref('职位') // 当前年级数据
  const currentChildrenNode = ref(null) // 当前班级数据
  const updateCurrentParentNode = (val) => {
    currentParentNode.value = val
  }
  const updateCurrentChildrenNode = (val) => {
    currentChildrenNode.value = val
  }
  onMounted(async () => {
    // 获取所有的年级和班级信息
    const resp = await getAllTeacherInfo()
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
      <TeacherSide
        @updateCurrentParentNode="updateCurrentParentNode"
        @updateCurrentChildrenNode="updateCurrentChildrenNode"
      ></TeacherSide>
      <TeacherTable
        :currentParentNode="currentParentNode"
        :currentChildrenNode="currentChildrenNode"
      ></TeacherTable>
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
