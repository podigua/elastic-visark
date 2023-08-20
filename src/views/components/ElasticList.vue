<script setup lang="ts">
import {reactive, ref, onMounted, computed, toRaw} from 'vue';
import {Delete, Edit, Plus, Search} from "@element-plus/icons-vue";
import {useSiteStore} from '@/store/modules/site.ts'
import {ElLoading} from "element-plus";
import {useRouter} from 'vue-router'
import ElasticForm from "@/views/components/ElasticForm.vue";
import {error, confirm, success} from "@/utils/message.ts";

const isVisible = ref<boolean>(false);
const router = useRouter();
const emit = defineEmits<{
  (e: "connecting"): void;
}>();
const filterText = ref('');
const loading = ref(false);
let form = reactive({});
const list = reactive([]);
const onConnect = (row: any) => {
  emit('connecting');
  const loading = ElLoading.service({
    lock: true,
    text: '连接中...'
  })
  useSiteStore().login(row).then(async res => {
    console.log("res", res);
    let version = res?.version?.number;
    if (version && version !== row.version) {
      let target = Object.assign({}, row);
      console.log("row", row, "target", target)
      target.version = version
      window.api.elastic.update(target).then(() => {
        row.version = version;
      }).catch(() => {

      })
    }
    await router.push("/home");
  }).catch(async err => {
    let success = await window.api.notice.show('错误信息', err.message);
    if (!success) {
      error(err.message)
    }
  }).finally(() => {
    loading.close();
  })
}
const add = () => {
  form = {};
  isVisible.value = true;
}
const edit = (row) => {
  form = Object.assign(form, row);
  isVisible.value = true;
}
const query = () => {
  loading.value = true;
  list.splice(0, list.length);
  window.api.elastic.getAll().then(data => {
    if (data && data.length > 0) {
      list.push(...data);
    }
  }).finally(() => {
    loading.value = false;
  })
}
const deleteById = (id) => {
  confirm("提示信息", "是否确认删除?").then(v => {
    window.api.elastic.deleteById(id).then(() => {
      let index = list.findIndex(data => data._id === id);
      if (index > -1) {
        list.splice(index, 1);
      }
      success("删除成功");
    })
  })
}
onMounted(() => {
  query();
})
const rows = computed(() => {
  if (filterText.value) {
    return list.filter(data => (data.name.indexOf(filterText.value) > -1 || data.url.indexOf(filterText.value) > -1));
  }
  return list;
});
</script>

<template>
  <div>
    <div style="display: flex;justify-content: space-between;margin: 5px 0">
      <el-button :icon="Plus" type="primary" @click="add" size="default">新增</el-button>
      <el-input v-model="filterText" style="width: 250px" placeholder="过滤..." :suffix-icon="Search"  size="default"></el-input>
    </div>
    <ElasticForm v-if="isVisible" v-model:visible="isVisible" v-model="form" @success="query"></ElasticForm>
    <el-table
        v-loading="loading"
        @row-dblclick="onConnect"
        :data="rows"
        :max-height="300"
        border
        stripe
    >
      <el-table-column prop="name" header-align="center" label="名称" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="url" header-align="center" label="地址" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="version" header-align="center" label="版本" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="action" header-align="center" label="操作" width="100" show-overflow-tooltip>
        <template v-slot="scope">
          <el-button-group>
            <el-button :disabled="useSiteStore()._id===scope.row._id" type="text" :icon="Edit" title="编辑" @click="edit(scope.row)"></el-button>
            <el-button :disabled="useSiteStore()._id===scope.row._id" type="text" :icon="Delete" title="删除" @click="deleteById(scope.row._id)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>