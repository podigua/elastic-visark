<script setup lang="ts">
import {value, toggle} from './dark.ts';
const change = () => {
  toggle();
}
</script>

<template>
  <div class="svg-icon" @click="change">
    <svg-icon v-if="value" icon-class="icon-moon" color="white"></svg-icon>
    <svg-icon v-else icon-class="icon-sun" ></svg-icon>
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