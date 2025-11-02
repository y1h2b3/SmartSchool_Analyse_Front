<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
  import { ref, watch, getCurrentInstance, onMounted } from 'vue'
  import { getAllStaffInfo } from '@/api/admin/medicalServices/dangerCall.ts'
  const instance = getCurrentInstance()

  const filterText = ref('')
  const treeRef = ref(null)

  watch(filterText, (val) => {
    if (!treeRef.value) return
    treeRef.value?.filter(val)
  })
  const filterNode = (val, data) => {
    if (!val) return true
    return data.label.includes(val)
  }
  const data = ref([])
  const hanlderTreeData = (data) => {
    if (data.childrenFlag) {
      instance.emit('updateCurrentChildrenNode', data.label)
    }
    if (data.parentFlag) {
      instance.emit('updateCurrentParentNode', data.label)
    }
  }
  onMounted(async () => {
    const postList = []
    const resp = await getAllStaffInfo(1, 1000000)
    resp.records.map((item) => {
      if (!postList.includes(item.location)) {
        postList.push(item.location)
      }
    })
    let i = 0
    postList.sort((o1, o2) => o1.localeCompare(o2))
    const obj = {
      id: ++i,
      label: '预约地点',
      parentFlag: true,
      children: postList.map((item) => ({
        id: ++i,
        label: item,
        childrenFlag: true,
      })),
    }
    data.value.push(obj)
  })
</script>

<template>
  <div class="content">
    <h4>医生管理</h4>
    <el-input v-model="filterText" placeholder="请输入关键字" class="el-input" />
    <div class="tree-container">
      <el-tree
        ref="treeRef"
        accordion
        :data="data"
        node-key="id"
        :filter-node-method="filterNode"
        :default-expanded-keys="[1, 2]"
        @node-click="hanlderTreeData"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    width: 30%;
    height: 100%;
    background-color: #fff;
    margin-right: 14px;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    h4 {
      margin: 0;
    }
    .el-input {
      margin: 15px auto;
    }
    .tree-container {
      max-height: 550px; // 设置树形组件的最大高度
      overflow-y: auto; // 添加垂直方向的滚动条
    }
  }
</style>
