<script setup lang="ts">
import {ref, reactive, onMounted, toRaw} from "vue"
import {FormInstance, FormRules} from "element-plus"
import {error, success} from "@/utils/message.ts";

const emit = defineEmits<{
  (e: "success"): void
  (e: "update:visible", visible: boolean): void
}>();
const formRef = ref<FormInstance>()
const props = defineProps({
  modelValue: {type: Object},
  visible: {type: Boolean, default: false}
})
const loading = ref<boolean>(false);
const isVisible = ref<boolean>(false);
const form = reactive({
  _id: "",
  name: "",
  url: "",
  username: "",
  password: "",
  version: "",
  time: new Date().getTime(),
})
const formRule = reactive<FormRules>({
  name: [{required: true, message: "名称为必填项", trigger: ['blur', 'change']}],
  url: [
    {required: true, message: "地址为必填项", trigger: ['blur', 'change']},
    {type: 'url', message: "地址格式不正确", trigger: ['blur', 'change']}
  ]
});
onMounted(() => {
  isVisible.value = <boolean>props.visible;
  if (props.modelValue && Object.keys(props.modelValue).length > 0) {
    Object.assign(form, props.modelValue);
  }
})
const close = () => {
  isVisible.value = false;
  emit("update:visible", false);
}
const save = () => {
  console.log("form", toRaw(form))
  formRef.value?.validate(v => {
    if (v) {
      loading.value = true;
      if (form._id) {
        update();
      } else {
        insert();
      }
    }
  })
}
const update = () => {
  window.api.elastic.update(toRaw(form)).then(() => {
    success("保存成功");
    emit("success");
    close();
  }).catch((err) => {
    console.log(err)
    error("保存失败");
  }).finally(() => {
    loading.value = false;
  })
}
const insert = () => {
  window.api.elastic.insert(toRaw(form)).then(() => {
    success("保存成功");
    emit("success");
    close();
  }).catch((err) => {
    console.log(err)
    error("保存失败");
  }).finally(() => {
    loading.value = false;
  })
}
</script>

<template>
  <el-dialog title="Elastic" v-model="isVisible" @close="close" :width="500">
    <el-form ref="formRef" :rules="formRule" :model="form" label-width="50px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="地址" prop="url">
            <el-input v-model="form.url" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="save">确定</el-button
          >
        </span>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>