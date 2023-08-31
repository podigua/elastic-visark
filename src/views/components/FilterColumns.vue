<script setup lang="ts">
import {PropType, ref, watch} from "vue";
import {Setting} from "@element-plus/icons-vue";


type Column = {
  prop: string,
  label: string,
}

const emit = defineEmits<{
  (e: "change", values: Array<string>): void;
}>()
const props = defineProps({
  columns: {type: Array as PropType<Array<Column>>, default: () => []},
  filterColumns: {type: Array, default: () => []}
})
const values = ref([]);
const visible = ref(false);

watch(() => props.filterColumns, (newValues :Array<Column>) => {
  values.value.splice(0, values.value.length);
  values.value.push(...newValues.map(data => data.prop));
}, {deep: true})
const filterMethod = (query, item) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
}
const save = () => {
  emit("change", values.value);
  close();
}
const close = () => {
  visible.value = false;
}
const show = () => {
  visible.value = true;
}
</script>

<template>
  <div>
    <el-button :disabled="columns.length===0" type="text" :icon="Setting" @click="show"></el-button>
    <el-dialog width="594px" title="展示列" v-model="visible" @close="close">
      <el-transfer
          v-model="values"
          :titles="['待选择','已选择']"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="过滤"
          :props="{key:'prop'}"
          :data="columns"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>