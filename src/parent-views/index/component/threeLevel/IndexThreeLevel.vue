<script lang="ts" setup>
  import { ref } from 'vue'
  import IndexOrder from './IndexOrder.vue'
  import IndexStore from './IndexStore.vue'
  import IndexNotice from './IndexNotice.vue'
</script>

<template>
  <div class="content">
    <div class="order">
      <IndexOrder></IndexOrder>
    </div>
    <div class="store">
      <IndexStore></IndexStore>
    </div>
    <div class="notice">
      <IndexNotice></IndexNotice>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @media (max-width: 768px) {
    .content {
      width: 100%;
      flex-direction: column;
      margin-top: 0px !important;
      .order {
        width: 100% !important;
        margin-bottom: 15px;
      }
      .store {
        width: 100% !important;
        margin-bottom: 15px;
      }
      .notice {
        width: 100% !important;
      }
    }
  }
  .content {
    width: 100%;
    height: 220px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    .order {
      width: calc(33% - 5px);
    }
    .store {
      width: calc(33% - 5px);
    }
    .notice {
      width: calc(33% - 5px);
    }
  }
</style>
