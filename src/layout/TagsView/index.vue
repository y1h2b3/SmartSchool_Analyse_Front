<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="tags-wrap-container">
    <div class="tags-view">
      <el-tabs v-model="activeTabsValue" type="card" @tab-click="tabClick" @tab-remove="removeTab">
        <el-tab-pane
          v-for="item in visitedViews"
          :key="item.path"
          :path="item.path"
          :label="item.title"
          :name="item.path"
          :closable="!(item.meta && item.meta.affix)"
        >
          <template #label>
            {{ item.title }}
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-btn">
      <MoreButton />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, watch, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { TabsPaneContext } from 'element-plus'
  import MoreButton from './components/MoreButton.vue'
  import path from 'path-browserify'
  import { useTagsViewStore } from '../../store/modules/tagsView'
  import { usePermissionStore } from '../../store/modules/permission'

  const route = useRoute()
  const router = useRouter()
  const TagsViewStore = useTagsViewStore()
  const PermissionStore = usePermissionStore()
  const visitedViews = computed(() => TagsViewStore.visitedViews)
  const routes = computed(() => PermissionStore.routes)
  const addTags = () => {
    const { name } = route
    if (name === 'Login') {
      return
    }
    if (name) {
      TagsViewStore.addView(route)
    }
    return false
  }
  let affixTags = ref([])
  function filterAffixTags(routes, basePath = '/') {
    let tags = []
    routes.forEach((route) => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path)
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta },
        })
      }
      if (route.children) {
        const tempTags = filterAffixTags(route.children, route.path)
        if (tempTags.length >= 1) {
          tags = [...tags, ...tempTags]
        }
      }
    })
    return tags
  }
  const initTags = () => {
    let routesNew = routes.value
    let affixTag = (affixTags.value = filterAffixTags(routesNew))
    for (const tag of affixTag) {
      if (tag.name) {
        TagsViewStore.addVisitedView(tag)
      }
    }
  }
  onMounted(() => {
    initTags()
    addTags()
  })
  watch(route, () => {
    addTags()
  })
  let tabIndex = 2
  const activeTabsValue = computed({
    get: () => {
      return TagsViewStore.activeTabsValue
    },
    set: (val) => {
      TagsViewStore.setTabsMenuValue(val)
    },
  })
  function toLastView(activeTabPath) {
    let index = visitedViews.value.findIndex((item) => item.path === activeTabPath)
    const nextTab = visitedViews.value[index + 1] || visitedViews.value[index - 1]
    if (!nextTab) return
    router.push(nextTab.path)
    TagsViewStore.addVisitedView(nextTab)
  }
  const tabClick = (tabItem: TabsPaneContext) => {
    let path = tabItem.props.name as string
    router.push(path)
  }
  const isActive = (path) => {
    return path === route.path
  }
  const removeTab = async (activeTabPath: string) => {
    if (isActive(activeTabPath)) {
      toLastView(activeTabPath)
    }
    await TagsViewStore.delView(activeTabPath)
  }
</script>
<style lang="scss" scoped>
  .tags-wrap-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    box-shadow: 2px -4px 2px #f1f1f1;
    .right-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
    }
    .ball {
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: #fff;
    }
  }
  .tags-view {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
  }
  .tags-view {
    .el-tabs--card :deep(.el-tabs__header) {
      box-sizing: border-box;
      height: 35px;
      padding: 0 10px;
      margin: 0;
    }
    :deep(.el-tabs) {
      .el-tabs__nav {
        padding: 5px 0;
        border: none;
        margin-right: 10px;
      }
      .el-tabs__header .el-tabs__item {
        color: #409eff;
        border: none;
        height: 25px;
        line-height: 25px;
        font-size: 11px;
        border: 1px solid #409eff;
        margin-right: 10px;
        border-radius: 5px;
      }
      .el-tabs__header .el-tabs__item.is-active {
        color: #fff;
        background-color: #409eff;
      }
    }
  }
</style>
