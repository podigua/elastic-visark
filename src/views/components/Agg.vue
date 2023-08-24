<script setup lang="ts">
import {reactive, ref, toRaw, watch, onMounted, PropType} from "vue";
import {Minus, Plus,} from "@element-plus/icons-vue";
import {ElTree} from "element-plus";
import {uuid} from "vue3-uuid"
type Field={
  value:string,
}
const props = defineProps({
  fields: {type: Object as PropType<Array<Field>>, default: () => []}
})

const emit = defineEmits<{
  (e: "change", aggregations: Object): void
}>();
watch(props.fields, () => {
  trees.splice(0, trees.length);
})
const trees = reactive([]);
const treeRef = ref<InstanceType<typeof ElTree>>()
const types = reactive([
  {value: "terms", label: "terms"},
  {value: "max", label: "max"},
  {value: "min", label: "min"},
  {value: "sum", label: "sum"},
  {value: "value_count", label: "count"},
  {value: "avg", label: "avg"},
  {value: "cardinality", label: "cardinality"},
  {value: "date_histogram", label: "date_histogram"},
])
watch(trees, (values) => {
  buildAndSend(values);
})
const buildAndSend = (values) => {
  let aggregations = getAggregations(values);
  emit("change", aggregations)
}

const getAggregations = (values) => {
  let result = {};
  if (!values || values.length === 0) {
    return {};
  }
  for (let index = 0; index < values.length; index++) {
    let agg = values[index];
    let alias = agg.alias ? agg.alias : agg.field;
    switch (agg.type) {
      case "max":
      case "min":
      case "sum":
      case "value_count":
      case "avg":
      case "cardinality":
        let simpleAgg = getSimpleAgg(agg);
        result[alias] = simpleAgg;
        break;
      case "date_histogram":
        let histogramAgg = getHistogram(agg);
        result[alias] = histogramAgg;
        break;
      case "terms":
        let termsAgg = getTerms(agg);
        result[alias] = termsAgg;
        break;
    }
  }
  return result;
}

const getTerms = (agg) => {
  let result = {};
  result[agg.type] = {
    "field": agg.field,
    "size": agg.size,
    "min_doc_count": 1,
    "shard_min_doc_count": 0,
    "show_term_doc_count_error": false
  };
  let aggregations = getAggregations(agg.children);
  if (aggregations && Object.keys(aggregations).length > 0) {
    result["aggregations"] = aggregations;
  }
  return result;
}

const getHistogram = (agg) => {
  let result = {};
  result[agg.type] = {"field": agg.field, "interval": agg.interval + agg.intervalUnit};
  return result;
}

const getSimpleAgg = (agg) => {
  let result = {};
  result[agg.type] = {"field": agg.field};
  return result;
}
const addAgg = () => {
  trees.push(buildAgg())
}
const addChildren = (data) => {
  data.children.push(buildAgg());
}

const intervals = reactive([
  {value: "s", label: "秒"},
  {value: "m", label: "分"},
  {value: "h", label: "时"},
  {value: "d", label: "天"},
  {value: "w", label: "周"},
  {value: "M", label: "月"},
  {value: "q", label: "季"},
  {value: "y", label: "年"},
]);

const removeById = (id) => {
  treeRef.value.remove(id);
}
const buildAgg = () => {
  return {
    id: uuid.v4(),
    size: 100,
    field: props.fields[0]?.value,
    interval: 30,
    intervalUnit: "m",
    alias: "",
    type: "terms",
    children: [],
  };
}
onMounted(() => {
  buildAndSend(trees);
});
</script>

<template>
  <div>
    <div style="display: flex;margin-bottom: 15px;">
      <el-button type="primary" :disabled="props.fields.length===0" :icon="Plus" @click="addAgg">添加字段</el-button>
    </div>
    <el-tree
        ref="treeRef"
        :data="trees"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <div class="container">
          <div class="left">
            <div>
              <el-select-v2 :options="types" v-model="data.type" style="width: 150px" filterable></el-select-v2>
            </div>
            <div>
              <el-select-v2 :options="fields" v-model="data.field" style="width: 150px" filterable></el-select-v2>
            </div>
            <div>
              <el-input v-model="data.alias" placeholder="别名"></el-input>
            </div>
            <div v-if="data.type==='date_histogram'">
              <el-input-number placeholder="间隔" v-model="data.interval" controls-position="right" style="width: 100px" :min="1"></el-input-number>
              <el-select v-model="data.intervalUnit" style="width: 50px">
                <el-option v-for="item in intervals" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </div>
            <div v-if="data.type==='terms'">
              <el-input-number placeholder="数量" v-model="data.size" controls-position="right" style="width: 100px" :min="1"></el-input-number>
            </div>
          </div>
          <div class="right">
            <el-button-group>
              <el-button v-if="data.type==='terms'" type="text" @click="addChildren(data)" :icon="Plus" title="添加"></el-button>
              <el-button type="text" @click="removeById(data.id)" :icon="Minus" title="移除"></el-button>
            </el-button-group>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.container .left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.container .left div {
  margin-left: 5px;
}

.container .right {
  width: 100px;
}
</style>