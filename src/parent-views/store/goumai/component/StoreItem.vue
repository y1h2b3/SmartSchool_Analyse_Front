<script lang="ts" setup>
  import { reactive, ref, onBeforeMount } from 'vue'
  // 用户是否屏幕放大
  import { useSettingStore } from '@/store/modules/setting'
  import StoreBuyDialog from './StoreBuyDialog.vue'
  const settingStore = useSettingStore()
  import dayjs from 'dayjs'
  import { getAllDrugsInfo, getPageSearchDrugs } from '@/api/parent/store.ts'
  const tableList = ref([])
  const currentPage = ref<number>(1)
  const pageSize = ref<number>(99999999)
  const total = ref<number>(0)
  const isLoading = ref(false)
  const buyDialogVisible = ref(false)
  const rowData = ref([])
  // 多条件查询数据
  const searchForm = reactive({
    name: '',
    type: '',
  })
  // 重置数据
  const reset = () => {
    searchForm.name = ''
    searchForm.type = ''
    freshData()
  }
  const restaurants = ref([])
  const createFilter = (queryString) => {
    return (restaurant) => {
      return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    }
  }
  const querySearch = (queryString, cb) => {
    const results = queryString
      ? restaurants.value.filter(createFilter(queryString))
      : restaurants.value
    cb(results)
  }
  const loadAll = () => {
    return [
      { value: 'vue', link: 'https://github.com/vuejs/vue' },
      { value: 'element', link: 'https://github.com/ElemeFE/element' },
      { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
      { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
      { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
      { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
      { value: 'babel', link: 'https://github.com/babel/babel' },
    ]
  }
  const handleSelect = (item) => {
    console.log(item)
  }
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD hh:mm:ss')
  }
  // 刷新数据
  const freshData = () => {
    getType()
    isLoading.value = true
    setTimeout(async () => {
      const current = currentPage.value
      const size = total.value === 0 ? pageSize.value : total.value
      const name = searchForm.name
      const status = searchForm.type
      const resp = await getPageSearchDrugs(current, size, name, status)
      tableList.value = resp.records
      for (let i = 0; i < tableList.value.length; i++) {
        tableList.value[i].order = (currentPage.value - 1) * pageSize.value + i + 1
        tableList.value[i].notes = tableList.value[i].notes ? tableList.value[i].notes : '无'
        tableList.value[i].createTime = formatDate(tableList.value[i].createTime)
        tableList.value[i].updateTime = formatDate(tableList.value[i].updateTime)
      }
      total.value = resp.total
      console.log(tableList.value)
      isLoading.value = false
    }, 500)
  }
  // 药品类型
  const options = ref([])
  // 获取药品类型
  const getType = async () => {
    options.value = []
    options.value.push({ value: '', label: '全部' })
    const mySet = []
    const resp = await getAllDrugsInfo()
    const data = resp.records
    for (let i = 0; i < data.length; i++) {
      if (!mySet.includes(data[i].type)) {
        mySet.push(data[i].type)
        options.value.push({ value: data[i].type, label: data[i].type })
      }
    }
  }
  onBeforeMount(() => {
    restaurants.value = loadAll()
    freshData()
  })
  /**
   * 购买详情
   */
  const openBuyDialog = (item) => {
    rowData.value = item
    // 开启弹窗
    buyDialogVisible.value = !buyDialogVisible.value
  }
</script>

<template>
  <StoreBuyDialog :buyDialogVisible="buyDialogVisible" :rowData="rowData"></StoreBuyDialog>
  <el-scrollbar class="scrollbar-box">
    <el-form class="el-form" :model="searchForm">
      <el-form-item label="药品名称" label-width="100" class="el-form-item" prop="name">
        <el-autocomplete
          v-model="searchForm.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input w-50"
          placeholder="请输入药品名称"
          @select="handleSelect"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="药品类型" label-width="100" class="el-form-item" prop="type">
        <el-select v-model="searchForm.type" style="width: 120px">
          <template v-for="item in options" :key="item.value">
            <el-option :label="item.label" :value="item.value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label-width="40">
        <el-button type="primary" @click="freshData">
          <el-icon style="margin-right: 3px"><Search /></el-icon>查询
        </el-button>
      </el-form-item>
      <el-form-item label-width="20">
        <el-button type="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-scrollbar>
  <el-scrollbar
    class="table-content"
    :style="{ height: `${settingStore.isFull ? 750 : 600}px !important` }"
  >
    <div
      v-if="isLoading"
      class="loading-placeholder"
      v-loading="isLoading"
      element-loading-text="Loading..."
    ></div>
    <div class="goods-box" v-else>
      <template v-for="item in tableList" :key="item">
        <div
          class="goods"
          :style="{ width: `${settingStore.isCollapse ? 286 : 323}px !important` }"
        >
          <div class="left">
            <div class="logo"></div>
          </div>
          <div class="right">
            <div>
              <span class="title">{{ item.name }}</span>
              <span class="type">{{ item.type }}</span>
            </div>
            <span class="dosage">{{ item.dosage }}</span>
            <span class="manufacturer">{{ item.manufacturer }}</span>
            <div class="symptoms">
              <span class="key">OTC</span>
              <span class="join">|</span>
              <span class="value">{{ item.symptoms }}</span>
            </div>
            <div class="buy-box">
              <el-button type="primary" size="small" @click="openBuyDialog(item)">购买</el-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </el-scrollbar>
</template>

<style lang="scss" scoped>
  .scrollbar-box {
    height: 70px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 18px 40px 0 20px;
    box-sizing: border-box;
    .el-form {
      display: flex;
      justify-content: flex-start;
      .el-form-item {
        margin: 0px;
      }
    }
  }
  .table-content {
    width: 100%;
    height: 100%;
    margin-top: 15px;
    background-color: #fff;
    .loading-placeholder {
      height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .goods-box {
      padding: 5px 10px;
      display: flex;
      flex-wrap: wrap;
      .goods {
        width: 286px;
        height: 120px;
        margin: 15px 5px;
        display: flex;
        .left {
          width: 100px;
          height: 100%;
          padding: 10px;
          box-sizing: border-box;
          .logo {
            width: 100%;
            height: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url('./src/assets/image/index/商品.png');
          }
        }
        .right {
          flex: 1;
          height: 100%;
          padding: 10px 10px 10px 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .buy-box {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            .el-button {
              width: 60px;
            }
          }
          > div {
            display: flex;
            span {
              margin-right: 5px;
            }
            .title,
            .type,
            .dosage {
              font-size: 14px;
            }
          }
          .dosage,
          .manufacturer {
            margin-top: 5px;
            font-size: 12px;
            opacity: 0.5;
          }
          .symptoms {
            margin-top: 5px;
            font-size: 12px;
            .key {
              color: #61b01f;
            }
            .join {
              color: #e8e8e8;
            }
            .value {
              color: #9a9a9a;
            }
          }
        }
      }
    }
  }
</style>
