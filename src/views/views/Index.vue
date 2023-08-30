<script setup lang="ts">
import {Refresh, Search, Setting} from "@element-plus/icons-vue";
import JsonView from "@/components/JsonView.vue"
import {ref, reactive, onMounted, toRaw, watch, onActivated,onDeactivated} from "vue"
import {indices, info, stats, close, open, deleteIndex, refresh, flush, clear} from "@/views/api/elastic.ts";
import moment from "moment";
import Point from "@/components/Point.vue"
import {confirm, success} from "@/utils/message.ts"
import {useRouter} from "vue-router"
onActivated(()=>{
  console.log("onActivated")
})
onDeactivated(()=>{
  console.log("onDeactivated")
})
const router = useRouter();
const json = reactive({a: "bbb"});
const loading = ref(false);
const filterText = ref('');
const visible = ref(false);
const list = [];
const title = ref('');
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
  loading.value = true;
  list.splice(0, list.length);
  indices().then(data => {
    let sorts = data.sort((a, b) => {
      let source = <string>a["index"];
      let target = b["index"];
      return source.localeCompare(target);
    });
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

const handleCommand = (command, index) => {
  switch (command) {
    case "info":
      showInfo(index);
      break;
    case "stats":
      showStats(index);
      break;
    case "close":
      closeIndex(index);
      break;
    case "open":
      openIndex(index);
      break;
    case "delete":
      deleteByIndex(index);
      break;
    case "refresh":
      refreshIndex(index);
      break;
    case "flush":
      flushIndex(index);
      break;
    case "clear":
      clearIndex(index);
      break;
  }
}

const showInfo = (index) => {
  info(index).then(res => {
    Object.keys(json).forEach(key => {
      delete json[key];
    });
    Object.assign(json, res);
    title.value = "详情(" + index + ")"
    visible.value = true;
  })
}
const showStats = (index) => {
  stats(index).then(res => {
    Object.keys(json).forEach(key => {
      delete json[key];
    });
    Object.assign(json, res);
    title.value = "状态(" + index + ")"
    visible.value = true;
  })
}
const closeIndex = (index) => {
  confirm("提示信息", `是否确认关闭[${index}]?`).then(() => {
    close(index).then(() => {
      success("操作成功");
      query();
    })
  })
}
const deleteByIndex = (index) => {
  confirm("提示信息", `是否确认删除[${index}]?`).then(() => {
    deleteIndex(index).then(() => {
      success("操作成功");
      query();
    })
  })
}
const refreshIndex = (index) => {
  confirm("提示信息", `是否确认刷新[${index}]?`).then(() => {
    refresh(index).then(() => {
      success("操作成功");
      query();
    })
  })
}
const flushIndex = (index) => {
  confirm("提示信息", `是否确认flush[${index}]?`).then(() => {
    flush(index).then(() => {
      success("操作成功");
      query();
    })
  })
}
const clearIndex = (index) => {
  confirm("提示信息", `是否确认清除[${index}]缓存?`).then(() => {
    clear(index).then(() => {
      success("操作成功");
      query();
    })
  })
}
const openIndex = (index) => {
  confirm("提示信息", `是否确认开启[${index}]?`).then(() => {
    open(index).then(() => {
      success("操作成功");
      query();
    })
  })
}

const toSearch = (index) => {
  router.push({
    name: "search",
    query: {
      index: index
    }
  })
}

onMounted(() => {
  query();
})
</script>

<template>
  <div>
    <JsonView v-if="visible" v-model="json" :title="title" v-model:visible="visible"></JsonView>
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
        <el-table :data="rows" border stripe height="calc(100vh - 240px)">
          <el-table-column header-align="center" prop="index" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="health" label="健康状态" width="120px" show-overflow-tooltip>
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
          <el-table-column align="center" prop="action" label="操作" width="80px">
            <template v-slot="scope">
              <div style="display: flex;justify-content: flex-start;align-items: center">
                <el-button v-if="scope.row.status==='open'" type="text" icon="Search" @click="toSearch(scope.row.index)"></el-button>
                <el-dropdown type="text" @command="(command)=>handleCommand(command,scope.row.index)">
                  <el-button :icon="Setting" type="text" style="width: 20px;"></el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="info">
                        <el-icon>
                          <InfoFilled/>
                        </el-icon>
                        <span>查看信息</span>
                      </el-dropdown-item>
                      <el-dropdown-item command="stats">
                        <el-icon>
                          <DataLine/>
                        </el-icon>
                        <span>查看状态</span>
                      </el-dropdown-item>
                      <el-dropdown-item divided v-if="scope.row.status==='open'" command="refresh">
                        <el-icon>
                          <RefreshRight/>
                        </el-icon>
                        <span>刷新索引</span>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.status==='open'" command="flush">
                        <el-icon>
                          <Refresh/>
                        </el-icon>
                        <span>flush索引</span>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.status==='open'" command="clear">
                        <el-icon>
                          <BrushFilled/>
                        </el-icon>
                        <span>清除缓存</span>
                      </el-dropdown-item>
                      <el-dropdown-item divided v-if="scope.row.index.indexOf('.')===-1 && scope.row.status==='open'" command="close">
                        <el-icon>
                          <Lock/>
                        </el-icon>
                        <span>关闭索引</span>
                      </el-dropdown-item>
                      <el-dropdown-item divided v-if="scope.row.status==='close'" command="open">
                        <el-icon>
                          <Unlock/>
                        </el-icon>
                        <span>开启索引</span>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.index.indexOf('.')===-1" command="delete">
                        <el-icon>
                          <Delete/>
                        </el-icon>
                        <span>删除</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}

</style>