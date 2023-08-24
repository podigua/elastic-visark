<script setup lang="ts">
import {ref, onMounted, toRaw} from "vue";

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
      <div style="height: 500px;overflow: auto;;border: solid 1px var(--el-border-color)">
        <json-viewer :value="modelValue" preview-mode copyable :show-double-quotes="true" theme="jv-light"></json-viewer>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped sc>
.my-awesome-json-theme {
  background: #fff;
  white-space: nowrap;
  color: #525252;
  font-size: 14px;
  font-family: Consolas, Menlo, Courier, monospace;
}

.my-awesome-json-theme .jv-ellipsis {
  color: #999;
  background-color: #eee;
  display: inline-block;
  line-height: 0.9;
  font-size: 0.9em;
  padding: 0px 4px 2px 4px;
  border-radius: 3px;
  vertical-align: 2px;
  cursor: pointer;
  user-select: none;
}

.my-awesome-json-theme .jv-button {
  color: #49b3ff;
}

.my-awesome-json-theme .jv-key {
  color: #111111;
}

.my-awesome-json-theme .jv-item.jv-array {
  color: #111111;
}

.my-awesome-json-theme .jv-item.jv-boolean {
  color: #fc1e70;
}

.my-awesome-json-theme .jv-item.jv-function {
  color: #067bca;
}

.my-awesome-json-theme .jv-item.jv-number {
  color: #fc1e70;
}

.my-awesome-json-theme .jv-item.jv-number-float {
  color: #fc1e70;
}

.my-awesome-json-theme .jv-item.jv-number-integer {
  color: #fc1e70;
}

.my-awesome-json-theme .jv-item.jv-object {
  color: #111111;
}

.my-awesome-json-theme .jv-item.jv-undefined {
  color: #e08331;
}

.my-awesome-json-theme .jv-item.jv-string {
  color: #42b983;
  word-break: break-word;
  white-space: normal;
}

.my-awesome-json-theme .jv-code .jv-toggle:before {
  padding: 0px 2px;
  border-radius: 2px;
}

.my-awesome-json-theme .jv-code .jv-toggle:hover:before {
  background: #eee;
}

</style>