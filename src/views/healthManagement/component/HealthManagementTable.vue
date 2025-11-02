<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
  import { ref, onMounted, computed } from 'vue'
  const tableList = ref([])
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filteredValue = ref([]) // 筛选条件
  /**
   * 根据 type 进行筛选
   */
  const curPageData = computed(() => {
    if (filteredValue.value.length > 0) {
      return tableList.value
        .filter((item) => filteredValue.value.includes(item.type))
        .slice(
          (currentPage.value - 1) * pageSize.value,
          (currentPage.value - 1) * pageSize.value + pageSize.value,
        )
    } else {
      return tableList.value.slice(
        (currentPage.value - 1) * pageSize.value,
        (currentPage.value - 1) * pageSize.value + pageSize.value,
      )
    }
  })
  /**
   * 计算当前数据总条数
   */
  // eslint-disable-next-line vue/return-in-computed-property
  const totel = computed(() => {
    if (filteredValue.value.length > 0) {
      return tableList.value.filter((item) => filteredValue.value.includes(item.type)).length
    } else {
      return tableList.value.length
    }
  })
  /**
   * 筛选职位信息
   */
  const filterHandler = (value, row, column) => {
    filteredValue.value = column.filteredValue
  }
  const getHealthStatus = (row) => {
    // 计算健康状态
    const status = Math.floor(Math.random() * 5 + 1)
    console.log(status)
    switch (status) {
      case 1:
        return 'success' // 优秀
      case 2:
        return 'primary'
      case 3:
        return 'info'
      case 4:
        return 'warning'
      case 5:
        return 'danger'
    }
  }
  /**
   * 行表格样式
   */
  const tableRowClassName = ({ row, rowIndex }) => {
    if (rowIndex % 2 === 0) {
      return 'warning-row' // 偶数行添加 warning 样式
    } else {
      return 'success-row' // 奇数行添加 success 样式
    }
  }

  onMounted(() => {
    for (let i = 0; i < 352; i++) {
      tableList.value.push({
        id: i + 1,
        type:
          Math.floor(Math.random() * 3 + 1) < 2
            ? '学生'
            : Math.floor(Math.random() * 3 + 1) < 3
            ? '教师'
            : '后勤管理员',
        idCard: i + 1,
        height: i + 1,
        weight: i + 1,
        step: i + 1,
        heartRate: i + 1,
        spo2: i + 1,
        calorie: i + 1,
        createTime: '2024-03-19',
        updateTime: '2024-03-19',
      })
    }
  })
</script>

<template>
  <div class="content">
    <div class="top">
      <el-button type="danger" @click="handleDeleteListClick"
        ><el-icon style="margin-right: 3px"><delete /></el-icon>批量删除</el-button
      >
    </div>
    <el-table :data="curPageData" :row-class-name="tableRowClassName">
      <el-table-column fixed type="selection" width="40"></el-table-column>
      <el-table-column prop="id" label="编号" width="150"></el-table-column>
      <el-table-column
        prop="type"
        label="职位"
        width="150"
        :filters="[
          { text: '学生', value: '学生' },
          { text: '教师', value: '教师' },
          { text: '后勤管理员', value: '后勤管理员' },
        ]"
        :filter-method="filterHandler"
      ></el-table-column>
      <el-table-column prop="idCard" label="学号" width="150"></el-table-column>
      <el-table-column prop="height" label="身高" width="150"></el-table-column>
      <el-table-column prop="weight" label="体重" width="150"></el-table-column>
      <el-table-column prop="step" label="步数" width="150"></el-table-column>
      <el-table-column prop="heartRate" label="心率" width="150"></el-table-column>
      <el-table-column prop="spo2" label="血氧" width="150"></el-table-column>
      <el-table-column prop="calorie" label="卡路里" width="150"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150"></el-table-column>
      <el-table-column prop="updateTime" label="最后修改时间" width="150"></el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template #default>
          <div class="optionStyle">
            <button link size="mini" class="button dangerStyle"
              ><el-icon><delete /></el-icon>删除</button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totel"
        class="el-pagination"
      />
      <el-button type="success" size="small" class="export_excel">
        <el-icon style="margin-right: 3px"><Download /></el-icon>导出 Excel
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    width: 100%;
    height: 500px;
    .top {
      height: 50px;
      display: flex;
      justify-content: flex-end;
    }
    .el-table {
      width: 100%;
      height: 460px;
      /* ::v-deep .warning-row {
        --el-table-tr-bg-color: var(--el-color-warning-light-9);
      }
      ::v-deep .success-row {
        --el-table-tr-bg-color: var(--el-color-success-light-9);
      } */
      .optionStyle {
        width: 120px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .button {
          width: 55px;
          height: 25px;
          color: #fff;
          font-size: 11px;
          border: none;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .dangerStyle {
          border-radius: 3px;
          background-color: #f56c6c;
        }
        .dangerStyle:hover {
          opacity: 0.7;
        }
      }
    }
    .demo-pagination-block {
      width: 100%;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-pagination {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
