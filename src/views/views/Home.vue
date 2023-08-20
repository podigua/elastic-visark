<script setup lang="ts">

import Nodes from "@/views/components/Nodes.vue";
import Health from "@/views/components/Health.vue";
</script>

<template>
  <el-row  :gutter="10">
    <el-col :offset="1" :xs="22" :sm="22" :md="22" :lg="10" :xl="10">
      <Nodes></Nodes>
    </el-col>
    <el-col :offset="1"  :xs="22" :sm="22" :md="22" :lg="10" :xl="10">
      <Health></Health>
    </el-col>
  </el-row>
</template>

<style scoped>
</style>