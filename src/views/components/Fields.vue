<script setup lang="ts">

import {reactive, ref, toRaw, watch,onMounted} from "vue";
import {Delete, Plus} from "@element-plus/icons-vue";
import FieldTransfer from "@/views/components/FieldTransfer.vue";

const visible = ref(false);
const includes = reactive([]);
const excludes = reactive([]);
const target = reactive([]);
const result = reactive({
  "includes": [],
  "excludes": [],
});
const type = ref("includes");
const emit = defineEmits<{
  (e: "change", value: object): void
  (e: "update:modelValue", values: []): void
}>()
const props = defineProps({
  values: {
    type: Object, default: () => {
      return {
        "includes": [],
        "excludes": [],
      }
    }
  },
  fields: {
    type: Array, default: () => {
    }
  }
})


watch(props.fields, () => {
  includes.splice(0, includes.length);
  excludes.splice(0, excludes.length);
  buildAndSend();
})
const buildAndSend = () => {
  result.includes = includes;
  result.excludes = excludes;
  emit("change", toRaw(result));
}
onMounted(()=>{
  excludes.push(...props.values.excludes)
  includes.push(...props.values.includes)
})

const show = (t) => {
  type.value = t;
  target.splice(0, target.length);
  if (type.value === 'includes') {
    target.push(...includes);
  } else {
    target.push(...excludes);
  }
  visible.value = true;
}

const onFieldChange = (values) => {
  if (type.value === 'includes') {
    includes.splice(0, includes.length);
    includes.push(...values);
  } else {
    excludes.splice(0, excludes.length);
    excludes.push(...values);
  }
  buildAndSend();
}
</script>

<template>
  <div>
    <FieldTransfer v-model:default-values="target" v-if="visible" v-model:visible="visible" :fields="fields" @change="onFieldChange"></FieldTransfer>
  </div>
  <el-form>
    <el-form-item label="包括">
      <el-tag
          v-for="(item,index) in includes"
          :key="index"
          style="margin-right: 5px"
          closable
          @close="()=>includes.splice(index,1)"
      >
        {{ item }}
      </el-tag>
      <el-button type="text" :disabled="fields.length===0" :icon="Plus" @click="show('includes')"></el-button>
      <el-button type="text" :disabled="includes.length===0" :icon="Delete" @click="includes.splice(0)"></el-button>
    </el-form-item>
    <el-form-item label="排除">
      <el-tag
          v-for="(item,index) in excludes"
          :key="index"
          style="margin-right: 5px"
          closable
          @close="()=>excludes.splice(index,1)"
      >
        {{ item }}
      </el-tag>
      <el-button type="text" :disabled="fields.length===0" :icon="Plus" @click="show('excludes')"></el-button>
      <el-button type="text" :disabled="excludes.length===0" :icon="Delete" @click="excludes.splice(0)"></el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>