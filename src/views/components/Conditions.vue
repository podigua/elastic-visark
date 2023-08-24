<script setup lang="ts">
import {reactive, ref, toRaw, watch, onMounted, PropType} from "vue";
import {Minus, Plus,} from "@element-plus/icons-vue";
import {ElTree} from "element-plus";
import {uuid} from "vue3-uuid"
type Values={
  value:string,
  label:string
}
const props = defineProps({
  fields: {type: Array as PropType<Array<Values>>, default: () => []}
})

const emit = defineEmits<{
  (e: "query", query: Object): void
}>();
watch(props.fields, () => {
  trees.splice(0, trees.length);
})
const trees = reactive([]);
const treeRef = ref<InstanceType<typeof ElTree>>()
const operators = reactive([
  {value: "term", label: "term"},
  {value: "terms", label: "terms"},
  {value: "wildcard", label: "wildcard"},
  {value: "match", label: "match"},
  {value: "range", label: "range"},
  {value: "exists", label: "exists"},
])
const leftOperators = reactive([
  {value: "gt", label: "gt"},
  {value: "gte", label: "gte"},
])
const rightOperators = reactive([
  {value: "lt", label: "lt"},
  {value: "lte", label: "lte"},
])
watch(trees, (values) => {
  buildAndSend(values);
})
const buildAndSend = (values) => {
  let bool = getBool(toRaw(values));
  let isNull = true;
  for (const key in bool) {
    let values = bool[key];
    if (values && values.length > 0) {
      isNull = false;
    }
  }
  if (!isNull) {
    emit("query", {"bool": bool})
  } else {
    emit("query", {
      "bool": {
        "must": [
          {
            "match_all": {}
          }
        ],
        "must_not": [],
        "should": []
      }
    })
  }
}

const getBool = (array) => {
  let result = {};
  if (!array || array.length == 0) {
    return result;
  }
  let mustArray = [];
  let mustNotArray = [];
  let shouldArray = [];
  if (array && array.length > 0) {
    for (let index = 0; index < array.length; index++) {
      let condition = array[index];
      if (!condition.enabled) {
        continue;
      }
      switch (condition.splicer) {
        case "must":
          mustArray.push(condition);
          break;
        case "must_not":
          mustNotArray.push(condition);
          break;
        case "should":
          shouldArray.push(condition);
          break;
      }
    }
  }
  let mustList = getConditions(mustArray);
  let mustNotList = getConditions(mustNotArray);
  let shouldList = getConditions(shouldArray);
  result["must"] = mustList;
  result["must_not"] = mustNotList;
  result["should"] = shouldList;
  return result;
}
const getConditions = (array) => {
  let result = [];
  if (array && array.length > 0) {
    array.forEach(condition => {
      if (condition.group) {
        let bool = getBool(condition.children);
        result.push({"bool": bool});
      } else {
        switch (condition.operator) {
          case "term":
          case "wildcard":
          case "match":
            let value = getSingleCondition(condition);
            if (value && Object.keys(value).length > 0) {
              result.push(value)
            }
            break;
          case "terms":
            let values = getSingleConditionArray(condition);
            if (values && Object.keys(values).length > 0) {
              result.push(values)
            }
            break;
          case "range":
            let rangeValues = getRangeValues(condition);
            if (rangeValues && Object.keys(rangeValues).length > 0) {
              result.push(rangeValues)
            }
            break;
          case "exists":
            let exists = {"field": condition.field}
            result.push({"exists": exists})
            break;
        }
      }
    })
  }
  return result;
}

const getSingleCondition = (condition) => {
  let result = {};
  let conditions = {};
  if (condition.value1) {
    let key = condition.field;
    conditions[key] = condition.value1;
  }
  if (conditions && Object.keys(conditions).length > 0) {
    result[condition.operator] = conditions;
  }
  return result;
}
const getSingleConditionArray = (condition) => {
  let result = {};
  let conditions = {};
  if (condition.value1) {
    let key = condition.field;
    conditions[key] = condition.value1.split(",");
  }
  if (conditions && Object.keys(conditions).length > 0) {
    result[condition.operator] = conditions;
  }
  return result;
}
const getRangeValues = (condition) => {
  let result = {};
  let conditions = {};
  let ranges = {};
  if (condition.value1) {
    ranges[condition.leftOperator] = condition.value1;
  }
  if (condition.value2) {
    ranges[condition.rightOperator] = condition.value2;
  }
  if (ranges && Object.keys(ranges).length > 0) {
    conditions[condition.field] = ranges;
  }
  if (conditions && Object.keys(conditions).length > 0) {
    result[condition.operator] = conditions;
  }
  return result;
}
const addCondition = () => {
  trees.push(buildCondition())
}
const addChildren = (data) => {
  data.children.push(buildCondition());
}
const onGroupChange = (value, data) => {
  if (!value) {
    data.children.splice(0, data.children.length);
  }
}
const removeById = (id) => {
  treeRef.value.remove(id);
}
const buildCondition = () => {
  return {
    id: uuid.v4(),
    enabled: true,
    splicer: "must",
    group: false,
    field: props?.fields[0]?.value,
    operator: "term",
    value1: "",
    value2: "",
    leftOperator: "gt",
    rightOperator: "lt",
    children: [],
  };
}
onMounted(() => {
  buildAndSend(trees);
});
</script>

<template>
  <div>
    <div style="display: flex;margin-bottom: 5px;">
      <el-button type="primary" :disabled="props.fields.length===0" :icon="Plus" @click="addCondition">添加条件
      </el-button>
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
              <el-checkbox v-model="data.enabled">启用</el-checkbox>
            </div>
            <div>
              <el-checkbox v-model="data.group" @change="(value)=>onGroupChange(value,data)">条件组</el-checkbox>
            </div>
            <div>
              <el-select v-model="data.splicer" style="width: 90px">
                <el-option value="must" label="must"></el-option>
                <el-option value="must_not" label="must_not"></el-option>
                <el-option value="should" label="should"></el-option>
              </el-select>
            </div>
            <div v-if="!data.group">
              <el-select-v2 :options="fields" v-model="data.field" clearable filterable></el-select-v2>
            </div>
            <div v-if="!data.group">
              <el-select-v2 :options="operators" v-model="data.operator" clearable filterable style="width: 120px"></el-select-v2>
            </div>
            <div v-if="!data.group && data.operator==='range'">
              <el-select :options="leftOperators" v-model="data.leftOperator" style="width: 60px">
                <el-option v-for="item in leftOperators" :value="item.value" :key="item.value" :label="item.label"></el-option>
              </el-select>
            </div>
            <div v-if="!data.group && data.operator!=='exists'" style="width: 220px">
              <el-input v-model="data.value1"></el-input>
            </div>
            <div v-if="!data.group && data.operator==='range'">
              <el-select :options="rightOperators" v-model="data.rightOperator" style="width: 60px">
                <el-option v-for="item in rightOperators" :value="item.value" :key="item.value" :label="item.label"></el-option>
              </el-select>
            </div>
            <div v-if="!data.group && data.operator==='range'" style="width: 220px">
              <el-input v-model="data.value2"></el-input>
            </div>
          </div>
          <div class="right">
            <el-button-group>
              <el-button v-if="data.group" type="text" @click="addChildren(data)" :icon="Plus" title="添加"></el-button>
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