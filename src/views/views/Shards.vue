<script setup lang="ts">
import {Refresh, Search, Setting} from "@element-plus/icons-vue";
import {ref, reactive, onMounted, toRaw, watch, computed} from "vue"
import {shards} from "@/views/api/elastic.ts";
import {useRouter} from "vue-router"
import {Shard} from "@/views/types/shards.ts";
import ShardCard from "@/views/components/ShardCard.vue";

const router = useRouter();
const loading = ref(false);
const filterText = ref('');
const visible = ref(false);
const list = [];
const rows = reactive<Array<Shard>>([]);
const page = reactive({
  total: 0,
  pageNum: 1,
  pageSize: 18
});
watch(filterText, () => {
  query4Num(1);
})
const query = () => {
  loading.value = true;
  list.splice(0, list.length);
  shards().then(res => {
    if (res && res.length > 0) {
      let sorts = res.sort((a, b) => {
        let source = <string>a["index"];
        let target = b["index"];
        let indexCompare = source.localeCompare(target)
        if (indexCompare === 0) {
          let sourcePrirep = <string>a["prirep"];
          let targetPrirep = b["prirep"];
          let prirepCompare = sourcePrirep.localeCompare(targetPrirep);
          if (prirepCompare === 0) {
            let sourceShard = <string>a["shard"];
            let targetShard = b["shard"];
            return sourceShard.localeCompare(targetShard);
          } else {
            return prirepCompare;
          }
        } else {
          return indexCompare;
        }
      });
      sorts.forEach((node) => {
        let find = list.find(data => data.index === node["index"]);
        let type = buildType(node);
        if (!find) {
          list.push({
            index: node["index"],
            ip: node["ip"],
            node: node["node"],
            docs: node["docs"],
            store: node["store"],
            types: [type]
          });
        } else {
          find.types.push(type);
        }
      })
      buildPage();
    }
  }).finally(() => {
    loading.value = false;
  })
}
const buildType = (node) => {
  return {
    prirep: node["prirep"],
    shard: node["shard"],
    state: node["state"],
  };
}
const buildPage = () => {
  rows.splice(0, rows.length);
  let start = (page.pageNum - 1) * page.pageSize;
  let end = page.pageNum * page.pageSize;
  if (filterText.value) {
    let result = toRaw(list).filter(data => data.index.toLowerCase().indexOf(filterText.value.toLowerCase()) > -1);
    page.total = result.length;
    rows.push(...result.slice(start, end));
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

onMounted(() => {
  query();
})
</script>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>分片</span>
          <div style="display: flex;">
            <el-button :icon="Refresh" text @click="query"></el-button>
            <el-input v-model="filterText" placeholder="过滤..." :icon="Search" style="width: 220px" clearable></el-input>
          </div>
        </div>
      </template>
      <div v-loading="loading">
        <div style="height:calc(100vh - 240px);overflow:auto;">
          <el-row >
            <template v-for="shard in rows">
              <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="4">
                <ShardCard :shard="shard"></ShardCard>
              </el-col>
            </template>
          </el-row>
        </div>
        <div class="pagination">
          <el-pagination
              :current-page="page.pageNum"
              :page-sizes="[18, 24, 30, 36, 42]"
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