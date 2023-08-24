<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {rest} from "@/views/api/elastic.ts"
import {error} from "@/utils/message.ts";

const right = ref(true);
const format = ref(true);
const loading = ref(false);
const result = reactive({});
const form = reactive({
  url: "/index/_search",
  method: "post",
  body: "",
  right: false,
})
watch(form, () => {
  if (form.url && form.url) {
    right.value = true;
  }
}, {deep: true});
watch(() => form.body, (value) => {
  if (format.value) {
    formatBody(value);
  }
}, {deep: true});

watch(format, (value) => {
  if (value) {
    formatBody(form.body);
  }
})

const formatBody = (value) => {
  if (value) {
    try {
      let body = JSON.stringify(JSON.parse(value), null, 2)
      form.body = body;
    } catch (e) {
    }
  }
}
const execute = () => {
  Object.keys(result).forEach(key => {
    delete result[key];
  })
  loading.value = true;
  rest(form.method, form.url, form.body).then(res => {
    Object.assign(result, res);
  }).catch((err) => {
    error(err.message);
    if(err?.response?.data){
      Object.assign(result, err?.response?.data);
    }
  }).finally(() => {
    loading.value = false;
  })
}
</script>

<template>
  <div class="container">
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
        <div style="text-align: right">
          <el-checkbox style="margin-right: 5px;" v-model="format">格式化</el-checkbox>
          <el-button type="primary" :disabled="!right" :loading="loading" @click="execute">执行</el-button>
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