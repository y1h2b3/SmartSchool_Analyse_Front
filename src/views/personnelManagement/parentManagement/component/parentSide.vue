<script lang="ts" setup>
  import { ref, watch, getCurrentInstance, onMounted } from 'vue'
  import { getAllParentInfo } from '@/api/admin/personnelManagement/parent.ts'
  const props = defineProps(['allFreshData'])
  const instance = getCurrentInstance()

  const filterText = ref('')
  const treeRef = ref(null)
  const currentIsFresh = ref(false)
  watch(
    () => props.allFreshData,
    () => {
      freshData()
    },
  )
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
  /**
   * 刷新年级
   */
  const freshData = async () => {
    if (currentIsFresh.value) return
    currentIsFresh.value = true
    // 获取所有的年级和班级信息
    const gradeMap = new Map()
    data.value = []

    const resp = await getAllParentInfo()
    resp.map((item) => {
      if (!gradeMap.get(item.grade)) {
        gradeMap.set(item.grade, [])
      }
      if (!gradeMap.get(item.grade).includes(item.clazz)) {
        gradeMap.get(item.grade).push(item.clazz)
      }
    })
    let i = 0
    // 部门
    const order1: Array<string> = ['小学部', '初中部', '高中部']
    const countStrArr: Array<string> = ['一', '二', '三', '四', '五', '六']
    order1.forEach((key) => {
      if (gradeMap.has(key)) {
        gradeMap.get(key).sort((o1, o2) => o1.localeCompare(o2))
        let arr: Array<string> = []
        for (let j = 0; j < (key === '小学部' ? 6 : 3); j++) {
          arr.push(
            ...gradeMap
              .get(key)
              .filter((item) => item.includes(countStrArr[j]))
              .sort((o1, o2) => o1.localeCompare(o2)),
          )
        }
        const obj = {
          id: ++i,
          label: key,
          parentFlag: true,
          children: arr.map((item) => ({
            id: ++i,
            label: item,
            childrenFlag: true,
          })),
        }
        data.value.push(obj)
      }
    })
    currentIsFresh.value = false
  }
  onMounted(() => {
    freshData()
  })
</script>

<template>
  <div class="content">
    <h4>监护人管理</h4>
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
