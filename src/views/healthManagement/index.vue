<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
  import HealthManagementHeader from './component/HealthManagementHeader.vue'
  import HealthManagementTable from './component/HealthManagementTable.vue'
</script>

<template>
  <div class="app-container">
    <div class="app-container-inner">
      <HealthManagementHeader></HealthManagementHeader>
      <HealthManagementTable></HealthManagementTable>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
