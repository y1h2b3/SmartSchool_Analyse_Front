<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
  import { ref, reactive } from 'vue'
  const fuzzyFormData = reactive({
    studentId: '',
    name: '',
    class: '',
    sex: [],
  })
</script>

<template>
  <div class="content">
    <el-form :model="fuzzyFormData" label-width="auto" class="el-form">
      <el-form-item label="编号" width="120" class="el-form-item">
        <el-input type="text" class="input" v-model="fuzzyFormData.studentId" />
      </el-form-item>
      <el-form-item label="姓名" width="120" class="el-form-item">
        <el-input type="text" class="input" v-model="fuzzyFormData.name" />
      </el-form-item>
      <el-form-item class="el-form-item">
        <div class="search-btn">
          <el-button type="primary">查询</el-button>
          <el-button type="default">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-form {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .el-form-item {
        margin-right: 50px;
        .input {
          width: 200px;
        }
      }
    }
  }
</style>
