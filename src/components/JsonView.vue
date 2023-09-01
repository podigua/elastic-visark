<script setup lang="ts">
import {ref, onMounted} from "vue";
import JsonText from "@/components/JsonText.vue";

const props = defineProps({
  modelValue: {type: Object},
  title: {type: String, default: "详情"},
  visible: {type: Boolean, default: false},
})
const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void
}>();
const isVisible = ref(false);
onMounted(() => {
  isVisible.value = props.visible;
})
const close = () => {
  emit("update:visible", false);
}
</script>

<template>
  <div>
    <el-dialog :title="title" v-model="isVisible" @close="close" top="5%">
      <div style="height: 500px;padding: 2px;border: solid 1px var(--el-border-color)">
        <JsonText :value="modelValue"></JsonText>
      </div>
    </el-dialog>
  </div>
</template>