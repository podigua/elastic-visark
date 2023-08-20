<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps({
  color: {type: String, required: false},
  size: {type: String, default: '10px'}
})
const realColor = computed(() => {
  if (props.color === 'yellow') {
    return '#F3A73B'
  }
  return props.color;
})
import SvgIcon from "@/components/SvgIcon.vue";
</script>

<template>
  <svg-icon v-if="color" icon-class="icon-point" :color="realColor" :size="size"></svg-icon>
</template>

<style scoped>

</style>