<script setup lang="ts">
import {Refresh, Search} from "@element-plus/icons-vue";
import {ref, reactive, onMounted, toRaw, watch, computed} from "vue"
import {indices} from "@/views/api/elastic.ts";
import moment from "moment";
import Point from "@/components/Point.vue"

const loading = ref(false);
const filterText = ref('');
const visible = ref(false);
const list = [];
const rows = reactive([]);
const page = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 20
});
watch(filterText, () => {
  query4Num(1);
})
const query = () => {
  loading.value = false;
  list.splice(0, list.length);
  indices().then(data => {
    let sorts = data.sort((a, b) => {
      let source = <string>a["index"];
      let target = b["index"];
      return source.localeCompare(target);
    });
    console.log("data", data)
    console.log("sorts", sorts)
    list.push(...sorts);
    buildPage();
  }).finally(() => {
    loading.value = false;
  })
}
const buildPage = () => {
  rows.splice(0, rows.length);
  let start = (page.pageNum - 1) * page.pageSize;
  let end = page.pageNum * page.pageSize;
  if (filterText.value) {
    let result = toRaw(list).filter(data => data.index.toLowerCase().indexOf(filterText.value.toLowerCase()) > -1).slice(start, end);
    page.total = result.length;
    rows.push(...result);
  } else {
    page.total = list.length;
    rows.push(...toRaw(list).slice(start, end));
  }
}
const query4Size = (pageSize) => {
  page.pageSize = pageSize;
  buildPage();
}

const query4Num = (pageNum) => {
  page.pageNum = pageNum;
  buildPage();
}
const tableHeight = computed(() => {
  return `100vh -60px`;
})

onMounted(() => {
  query();
})
</script>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>索引</span>
          <div style="display: flex;">
            <el-button :icon="Refresh" text @click="query"></el-button>
            <el-input v-model="filterText" placeholder="过滤..." :icon="Search" style="width: 220px" clearable></el-input>
          </div>
        </div>
      </template>
      <div v-loading="loading">
        <el-table :data="rows" border stripe :heighh="tableHeight">
          <el-table-column header-align="center" prop="index" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="health" label="监控状态" width="120px" show-overflow-tooltip>
            <template v-slot="scope">
              <div style="display: flex;align-items: center;justify-content: flex-start">
                <Point :color="scope.row.health"></Point>
                <span style="margin-left: 5px;">{{ scope.row.health }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column header-align="center" prop="uuid" label="UUID" width="200px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="load" label="分片" width="100px">
            <template v-slot="scope">
              <span>{{ scope.row.pri + ' / ' + scope.row.rep }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="docs.count" label="数量" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="store.size" label="存储空间" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="memory.total" label="占用内存" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="creation.date" label="创建时间" width="170px">
            <template v-slot="scope">
              <span>{{
                  moment(new Date(Number.parseInt(scope.row['creation.date']))).format('yyyy-MM-DD HH:mm:ss')
                }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="action" label="操作" width="60px">

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
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}

</style>