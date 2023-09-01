<script setup lang="ts">
import {value, toggle} from './dark.ts';
import {Moon, Sunny} from "@element-plus/icons-vue";
const change = () => {
  toggle();
}
</script>

<template>
  <div class="svg-icon" @click="change">
    <el-icon :size="20" v-if="value"><Moon /></el-icon>
    <el-icon v-else :size="20"><Sunny /></el-icon>
  </div>
</template>

<style scoped>
.svg-icon {
  display: flex;
  justify-items: center;
  align-items: center;
  cursor: pointer;
}
</style>