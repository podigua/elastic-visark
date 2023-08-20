<template>
  <svg :class="classList" aria-hidden="true" :width="size" :height="size">
    <use :xlink:href="iconName" rel="external nofollow" :fill="color"/>
  </svg>
</template>
<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps({
  className: {
    type: String,
    default: ''
  }, iconClass: {
    type: String,
    required: true
  }, color: {
    type: String,
    default: ''
  }, size: {
    type: String,
    default: '20px'
  }
})
const classList = computed(() => {
  return ['svg-icon', props.className || '']
})
const iconName = computed(() => {
  return `#${props.iconClass}`
})
</script>
<style scoped>
.svg-icon {
  color: currentColor;
}
</style>