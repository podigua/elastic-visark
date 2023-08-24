<script setup lang="ts">
import {onMounted, reactive, ref, toRaw, watch} from "vue"

const props = defineProps({
  defaultValues: {type: Array, default: []},
  fields: {type: Array, default: []},
  visible: {type: Boolean, default: false},
})

type Values={
  value:string,
  label:string
}
const emit = defineEmits<{
  (e: "change", value: Array<Values>): void
  (e: "update:visible", visible: boolean): void
}>()


const values = ref([]);
const isVisible = ref(false);
onMounted(() => {
  isVisible.value = props.visible;
  values.value.push(...props.defaultValues);
})

const filterMethod = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
}

const close = () => {
  isVisible.value = false;
  emit("update:visible", false);
}
const save = () => {
  emit("change", toRaw(values.value));
  close();
}

</script>

<template>
  <el-dialog width="594px" title="选择" v-model="isVisible" @close="close">
    <el-transfer
        v-model="values"
        :titles="['待选择','已选择']"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="过滤"
        :props="{
          key:'value',
        }"
        :data="fields"
    />
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>