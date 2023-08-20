<script setup lang="ts">
import {ref, reactive, onMounted} from "vue"
import {Refresh} from "@element-plus/icons-vue";
import {nodes} from "@/views/api/elastic.ts"
import {build, KeyValue} from "@/views/utils/elastic.ts";

const loading = ref(false);
const interval = ref(-1);
const times = reactive([
  {value: -1, label: "None"},
  {value: 15 * 1000, label: "15秒"},
  {value: 30 * 1000, label: "30秒"},
  {value: 60 * 1000, label: "1分"},
])
const list = reactive<Array<KeyValue>>([]);
let timer = null;
const query = () => {
  loading.value = false;
  list.splice(0, list.length);
  let array: Array<KeyValue> = [];
  nodes().then((data) => {
    build(data, '', array);
    array.forEach(node => {
      list.push(node);
    })
  }).finally(()=>{
    loading.value = false;
  })
}
const setTimer = (value) => {
  clearInterval(timer);
  if (value > 0) {
    timer = setInterval(() => {
      query();
    }, value);
  }
}
onMounted(() => {
  query()
})
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>节点信息</span>
        <div>
          <el-button :icon="Refresh" text @click="query"></el-button>
          <el-select v-model="interval" style="width: 70px;--el-border-color: #00000000;" @change="setTimer">
            <el-option v-for="item in times" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
      </div>
    </template>
    <div v-loading="loading">
      <template v-for="item in list">
        <div class="row">
          <div>{{ item.key }}</div>
          <div>{{ item.value }}</div>
        </div>
      </template>
    </div>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}

.row {
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px var(--el-border-color);
}

.row div {
  padding: 5px;
}
</style>