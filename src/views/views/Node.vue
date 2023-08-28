<script setup lang="ts">
import {Refresh} from "@element-plus/icons-vue";
import {ref, reactive, onMounted} from "vue"
import {nodeList} from "@/views/api/elastic.ts";

const loading = ref(false);
const visible = ref(false);

const lines = reactive([]);
const showDetail = (row) => {
  lines.splice(0, lines.length);
  for (const key in row) {
    lines.push({
      key, value: row[key]
    })
  }
  visible.value = true;
}
const list = reactive([]);
const query = () => {
  list.splice(0, list.length);
  nodeList().then(data => {
    if (data && data.length > 0) {
      data.forEach(row => {
        list.push(row);
      })
    }
  })
}

onMounted(() => {
  query();
})
</script>

<template>
  <div>
    <el-dialog title="详情" v-model="visible">
      <div style="max-height: 500px;overflow-y: auto;">
        <template v-for="item in lines">
          <div style="display: flex;justify-content: space-between;border-bottom: solid 1px var(--el-border-color)">
            <div>{{ item.key }}</div>
            <div>{{ item.value }}</div>
          </div>
        </template><template v-for="item in lines">
        <div style="display: flex;justify-content: space-between;border-bottom: solid 1px var(--el-border-color)">
          <div>{{ item.key }}</div>
          <div>{{ item.value }}</div>
        </div>
      </template>
      </div>
    </el-dialog>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>节点</span>
          <div>
            <el-button :icon="Refresh" text @click="query"></el-button>
          </div>
        </div>
      </template>
      <div v-loading="loading">
        <el-table :data="list" border stripe>
          <el-table-column header-align="center" prop="name" label="名称" width="150px" show-overflow-tooltip></el-table-column>
          <el-table-column header-align="center" prop="http_address" label="地址" width="150px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="version" label="版本" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="master" label="主节点" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="node.role" label="节点角色" width="100px" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="load" label="负载(1m/5m/15m)" width="200px">
            <template v-slot="scope">
              <span>{{ scope.row.load_1m + '/' + scope.row.load_5m + "/" + scope.row.load_15m }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="cpu" label="CPU" width="100px">
            <template v-slot="scope">
              {{ scope.row.cpu + "%" }}
            </template>
          </el-table-column>
          <el-table-column header-align="center" prop="ram" label="内存">
            <template v-slot="scope">
              <span>{{ scope.row['ram.current'] + "/" + scope.row['ram.max'] }}</span>
              <el-progress :percentage="scope.row['ram.percent']"/>
            </template>
          </el-table-column>
          <el-table-column header-align="center" prop="heap" label="堆内存">
            <template v-slot="scope">
              <span>{{ scope.row['heap.current'] + "/" + scope.row['heap.max'] }}</span>
              <el-progress :percentage="scope.row['heap.percent']"/>
            </template>
          </el-table-column>
          <el-table-column header-align="center" prop="heap" label="磁盘">
            <template v-slot="scope">
              <span>{{ scope.row['disk.used'] + "/" + scope.row['disk.total'] }}</span>
              <el-progress :percentage="scope.row['disk.used_percent']"/>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="action" label="操作" width="60px">
            <template v-slot="scope">
              <el-button type="text" icon="Document" title="详情" @click="showDetail(scope.row)"></el-button>
            </template>
          </el-table-column>

        </el-table>
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