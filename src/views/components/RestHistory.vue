<script setup lang="ts">
import {onMounted, PropType, reactive, ref, toRaw, watch} from "vue"
import {History} from "@/views/types/history.ts";
import moment from "moment";
import {Delete} from "@element-plus/icons-vue";

const emit = defineEmits<{
  (e: "success", row: History): void
  (e: "on-delete", id: string): void
}>()
const filterText = ref('');
const form = reactive<History>({
  _id: "",
  siteId: "",
  time: 0,
  url: "",
  method: "",
  body: ""
})
const rows = reactive<Array<History>>([]);
const props = defineProps({
  list: {type: Array as PropType<Array<History>>, default: () => []},
})
watch(() => props.list, () => {
  buildPage();
}, {deep: true})
const page = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 20
});
watch(filterText, () => {
  query4Num(1);
})
const buildPage = () => {
  rows.splice(0, rows.length);
  let start = (page.pageNum - 1) * page.pageSize;
  let end = page.pageNum * page.pageSize;
  if (filterText.value) {
    let result = toRaw(props.list).filter(data => data.url.toLowerCase().indexOf(filterText.value.toLowerCase()) > -1 || data.body.toLowerCase().indexOf(filterText.value.toLowerCase()) > -1).slice(start, end);
    page.total = result.length;
    rows.push(...result);
  } else {
    page.total = props.list.length;
    rows.push(...toRaw(props.list).slice(start, end));
  }
}
const send = () => {
  emit("success", form);
}
const query4Size = (pageSize) => {
  page.pageSize = pageSize;
  buildPage();
}

const deleteById = (id) => {
  window.api.history.deleteById(id).then(res => {
    console.log("delete", id);
    Object.keys(form).forEach(key => {
      form[key] = "";
    })
    emit("on-delete", id);
  })
}

const query4Num = (pageNum) => {
  page.pageNum = pageNum;
  buildPage();
}
onMounted(() => {
  buildPage();
  console.log(props.list, rows);
})
const onRowClick = (row) => {
  Object.assign(form, row);
}
</script>

<template>
  <div style="display: flex;justify-content: right;padding: 5px;">
    <el-input clearable v-model="filterText" placeholder="过滤" style="width: 220px"></el-input>
  </div>
  <el-table :data="rows" stripe border :height="370" @row-click="onRowClick">
    <el-table-column align="center" label="方法" prop="method" width="100px"></el-table-column>
    <el-table-column header-align="center" label="地址" prop="url" show-overflow-tooltip></el-table-column>
    <el-table-column align="center" label="时间" prop="time" width="180px">
      <template v-slot="scope">
        <span>{{ moment(new Date(scope.row.time)).format('yyyy-MM-DD HH:mm:ss') }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="action" label="操作" width="80px">
      <template v-slot="scope">
        <el-button type="text" @click="deleteById(scope.row._id)" :icon="Delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
        :current-page="page.pageNum"
        :page-sizes="[10, 15, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="page.total"
        @size-change="query4Size"
        @current-change="query4Num"
    >
    </el-pagination>
  </div>
  <el-input type="textarea" :rows="12" v-model="form.body"></el-input>
  <div style="display: flex;justify-content: right;padding: 5px;">
    <el-button>取 消</el-button>
    <el-button type="primary" :disabled="!form.url" @click="send">确 定</el-button>
  </div>
</template>


<style scoped>

</style>