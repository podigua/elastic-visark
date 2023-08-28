<script setup lang="ts">
import {reactive, ref, watch, onMounted, nextTick} from "vue";
import {rest} from "@/views/api/elastic.ts"
import {error} from "@/utils/message.ts";
import {useSiteStore} from "@/store/modules/site.ts"
import {History} from "@/views/types/history.ts";
import RestHistory from "@/views/components/RestHistory.vue";

const isRecord = ref(true);
const drawer = ref(false);
const loading = ref(false);
const result = reactive({});
const histories = reactive<Array<History>>([]);
const form = reactive({
  url: "/index/_search",
  method: "post",
  body: "",
})
watch(form, () => {
  isRecord.value = true;
}, {deep: true});

const formatBody = () => {
  try {
    let body = JSON.stringify(JSON.parse(form.body), null, 2)
    form.body = body;
  } catch (e) {
    console.log(e)
    error(e);
  }
}
const execute = () => {
  Object.keys(result).forEach(key => {
    delete result[key];
  })
  loading.value = true;
  rest(form.method, form.url, form.body).then(res => {
    Object.assign(result, res);
    insertHistory();
  }).catch((err) => {
    error(err.message);
    if (err?.response?.data) {
      Object.assign(result, err?.response?.data);
    }
  }).finally(() => {
    loading.value = false;
  })
}
const insertHistory = () => {
  if (isRecord.value) {
    window.api.history.insert(({
      siteId: useSiteStore()._id,
      method: form.method,
      url: form.url,
      body: form.body,
      time: new Date().getTime()
    })).then(res => {
      isRecord.value = false;
      histories.splice(0, 0, res);
      console.log("histories", histories)
    })
  }
}
const onSelectHistory = (row: History) => {
  form.method = row.method;
  form.body = row.body;
  form.url = row.url;
  nextTick(() => {
    isRecord.value = false;
    drawer.value = false;
  })
}
const onDeleteHistory = (id) => {
  let index = histories.findIndex(data => data._id === id);
  if (index > -1) {
    histories.splice(index, 1);
  }
}
onMounted(() => {
  window.api.history.getList(useSiteStore()._id).then(res => {
    console.log("getList", res)
    if (res && res.length > 0) {
      histories.push(...res);
    }
  })
})
</script>

<template>
  <div class="container">
    <el-drawer v-model="drawer" size="35%" title="历史记录">
      <RestHistory v-model:list="histories" @success="onSelectHistory" @on-delete="onDeleteHistory"></RestHistory>
    </el-drawer>
    <el-row :gutter="10">
      <el-col :span="5">
        <el-form ref="formRef" :model="form" label-width="5px">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="method">
                <el-select v-model="form.method" style="width: 100px">
                  <el-option value="post" label="POST"></el-option>
                  <el-option value="get" label="GET"></el-option>
                  <el-option value="put" label="PUT"></el-option>
                  <el-option value="delete" label="DELETE"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="url">
                <el-input v-model="form.url" placeholder="/index/_search" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="body">
                <el-input v-model="form.body" type="textarea" :rows="24"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="display: flex;justify-content: space-between">
          <div>
            <el-button type="text" @click="drawer=true">历史记录</el-button>
          </div>
          <div>
            <el-button type="primary" :disabled="!form.body"  @click="formatBody">格式化</el-button>
            <el-button type="primary" :disabled="!form.url" :loading="loading" @click="execute">执行</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div v-loading="loading" style="height: calc(100vh - 80px);overflow: auto;;border: solid 1px var(--el-border-color)">
          <json-viewer :value="result" preview-mode copyable :show-double-quotes="true" theme="jv-light"></json-viewer>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>

</style>