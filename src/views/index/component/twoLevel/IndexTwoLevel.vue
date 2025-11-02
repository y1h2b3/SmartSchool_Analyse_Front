<script lang="ts" setup>
  import { ref } from 'vue'
  import IndexPropose from './IndexPropose.vue'
  import IndexReason from './IndexReason.vue'
  import IndexSleep from './IndexSleep.vue'
</script>

<template>
  <div class="content">
    <div class="reason">
      <IndexReason></IndexReason>
    </div>
    <div class="sleep">
      <IndexSleep></IndexSleep>
    </div>
    <div class="propose">
      <IndexPropose></IndexPropose>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @media (max-width: 768px) {
    .content {
      width: 100%;
      flex-direction: column;
      margin-top: 0px !important;
      .propose {
        width: 100% !important;
        margin-bottom: 15px;
      }
      .reason {
        width: 100% !important;
        margin-bottom: 15px;
      }
      .sleep {
        width: 100% !important;
        margin-bottom: 15px;
      }
    }
  }
  .content {
    width: 100%;
    height: 250px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    .propose {
      width: calc(33% - 5px);
    }
    .reason {
      width: calc(33% - 5px);
    }
    .sleep {
      width: calc(33% - 5px);
    }
  }
</style>
