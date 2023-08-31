<script setup lang="ts">
import {ref, reactive, toRaw, watch, onActivated} from "vue"
import {useRoute} from "vue-router"
import {info, simpleIndices, searchByIndex} from "@/views/api/elastic.ts"
import {error} from "@/utils/message.ts";
import Conditions from "@/views/components/Conditions.vue";
import Fields from "@/views/components/Fields.vue";
import Agg from "@/views/components/Agg.vue";
import JsonView from "@/components/JsonView.vue";
import {Download, Search} from "@element-plus/icons-vue";
import Point from "@/components/Point.vue";
import FilterColumns from "@/views/components/FilterColumns.vue";
import JsonText from "@/components/JsonText.vue";

const sourceFields = reactive({
  "includes": [],
  "excludes": [],
});
const route = useRoute();
const loading = ref(false);
const page = reactive({
  pageNum: 1,
  pageSize: 15,
  total: 0
});
const isShowCurrentRow = ref(false);
const isDownloading = ref(false);
const isShowSelectColumn = ref(false);
const conditions = reactive({});
const currentRow = reactive({});
const errors = reactive({});
const rows = ref([]);
const aggregations = reactive({});
const result = reactive({});
const form = reactive({
  index: "",
  simple: true,
  timeout: 60,
  trackTotalHits: true,
})
watch(() => form.index, () => {
  Object.keys(result).forEach(key => {
    delete result[key];
  })
  columns.splice(0, columns.length);
  filterColumns.splice(0, columns.length);
  rows.value.splice(0, rows.value.length);
  page.total = 0;
})
const columns = reactive([]);
const filterColumns = reactive([]);
const query = reactive({});
const indices = reactive([]);
const fields = reactive([]);
const isShowQuery = ref(false);
const isShowError = ref(false);
onActivated(() => {
  buildConditions();
  simpleIndices().then(data => {
    if (data && data.length > 0) {
      let sorts = data.filter(data => {
        let index: string = data["index"];
        let indexOf = index.indexOf(".");
        if (indexOf === 0) {
          return false;
        }
        return true;
      }).sort((a, b) => {
        let source = <string>a["index"];
        let target = b["index"];
        return source.localeCompare(target);
      });
      let filters: Array<Object> = sorts.filter(data => data["status"] === 'open').map(data => {
        return {
          label: data["index"],
          value: data["index"],
          count: data["docs.count"],
          status: data["status"],
          health: data["health"],
        }
      })
      indices.push(...filters);
    }
  })
  let defaultIndex: string = <string>route?.query?.index;
  if (defaultIndex) {
    form.index = defaultIndex;
    getFields(form.index);
  }
})
const buildConditions = () => {
  for (const key in conditions) {
    delete conditions[key];
  }
  Object.keys(conditions).forEach(key => {
    delete conditions[key];
  })
  conditions["query"] = query;
  conditions["timeout"] = form.timeout + "s";
  if (form.trackTotalHits) {
    conditions["track_total_hits"] = 2147483647;
  }
  if (form.simple) {
    conditions["from"] = (page.pageNum - 1) * page.pageSize;
    conditions["size"] = page.pageNum * page.pageSize;
    conditions["_source"] = sourceFields;
  } else {
    conditions["from"] = 0;
    conditions["size"] = 0;
    if (Object.keys(aggregations).length > 0) {
      conditions["aggregations"] = aggregations;
    }
  }
}
const onColumnChange = (values) => {
  filterColumns.splice(0, filterColumns.length);
  values.forEach(column => {
    filterColumns.push({
      align: "center",
      label: column,
      prop: column,
      width: 180,
    })
  })

}
const getFields = (index) => {
  fields.splice(0, fields.length);
  if (!index) {
    return;
  }
  info(index).then(res => {
    if (res && Object.keys(res).length > 0) {
      let set = new Set();
      Object.keys(res).forEach(key => {
        let properties = res[key]?.mappings?.properties;
        if (properties && Object.keys(properties).length > 0) {
          for (let key in properties) {
            set.add(key);
          }
        }
      })
      let array = Array.from(set);
      let sorts = array.sort((a: string, b: string) => a.localeCompare(b));
      fields.push(...sorts.map(data => {
        return {
          label: data, value: data
        }
      }));
    }
  }).catch((err) => {
    error(err.message);
  })
}
const onFieldChange = (value) => {
  sourceFields.includes = value.includes;
  sourceFields.excludes = value.excludes;
  buildConditions();
}
watch(sourceFields, () => {
}, {deep: true})
const onQueryChange = (items) => {
  Object.keys(query).forEach(key => {
    delete query[key];
  })
  Object.assign(query, items)
  buildConditions()
}
const showQuery = () => {
  isShowQuery.value = true;
}
const onAggChange = (values) => {
  Object.keys(aggregations).forEach(key => {
    delete aggregations[key];
  })
  Object.assign(aggregations, values);
  buildConditions();
}
const query4Size = (size) => {
  page.pageSize = size;
  buildConditions();
  search();
}
const query4Num = (num) => {
  page.pageNum = num;
  buildConditions();
  search();
}
const search = () => {
  if (!form.index) {
    return;
  }
  loading.value = true;
  Object.keys(result).forEach(key => {
    delete result[key];
  })
  rows.value.splice(0, rows.value.length);
  searchByIndex(form.index, toRaw(conditions), form.timeout).then(res => {
    Object.assign(result, res);
    if (form.simple) {
      page.total = res.hits?.total?.value;
      columns.splice(0, columns.length);
      let set = new Set<string>();
      let list = res.hits?.hits;
      if (list && list.length > 0) {
        let start = new Date().getTime();
        list.forEach((item, index) => {
          let row = item._source;
          Object.keys(row).forEach(key => {
            set.add(key);
          })
          row["__source"] = JSON.parse(JSON.stringify(item));
          rows.value.push(row);
        })
        let array = Array.from(set);
        let sorts = array.sort((a, b) => a.localeCompare(b));
        if (filterColumns.length === 0) {
          sorts.forEach(value => {
            filterColumns.push({
              align: "center",
              label: value,
              prop: value,
              width: 180,
            })
          })
        }
        sorts.forEach(value => {
          columns.push({
            align: "center",
            label: value,
            prop: value,
            width: 180,
          })
        })
        let end = new Date().getTime();
        console.log("耗时:", (end - start));
      }
    }
  }).catch((err) => {
    Object.keys(errors).forEach(key => {
      delete errors[key];
    })
    if (err?.response?.data) {
      Object.assign(errors, err?.response?.data);
      isShowError.value = true;
    } else {
      error(err.message);
    }

  }).finally(() => {
    loading.value = false;
  })
}
const onRowdblClick = (row) => {
  if (row && row["__source"]) {
    let start = new Date().getTime();
    isShowCurrentRow.value = true;
    Object.keys(currentRow).forEach(key => {
      delete currentRow[key];
    })
    Object.assign(currentRow, row["__source"])
    let end = new Date().getTime();
    console.log("show row over", (end - start));
  }
}
const downloadExcel = () => {
  let headers = columns.map(column => column.prop);
  let list = toRaw(rows.value);
  let filename = `${form.index}-${new Date().getTime()}.xlsx`;
  isDownloading.value = true;
  window.api.openSaveFolder(filename).then(res => {
    let canceled = res.canceled
    if (!canceled) {
      window.api.export.excel(res.filePath, '', headers, list).then(res => {
        console.log("下载完成", res);
      }).catch(err => {
        console.log("下载失败", err);
      }).finally(() => {
        isDownloading.value = false;
      })
    } else {
      isDownloading.value = false;
    }
  }).catch(() => {
    isDownloading.value = false;
  })
}
</script>

<template>
  <div>
    <JsonView v-if="isShowCurrentRow" v-model="currentRow" v-model:visible="isShowCurrentRow"></JsonView>
    <JsonView v-if="isShowQuery" v-model:visible="isShowQuery" title="查询条件" v-model="conditions"></JsonView>
    <JsonView v-if="isShowError" v-model:visible="isShowError" title="错误信息" v-model="errors"></JsonView>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-form inline>
          <el-form-item label="索引">
            <el-select-v2 v-model="form.index" :options="indices" clearable filterable style="width: 250px" allow-create @change="getFields">
              <template #default="{ item }">
                <div style="display: flex;justify-content: flex-start;align-items: center;">
                  <div>
                    <Point :color="item.health" size="10px"></Point>
                  </div>
                  <div style="margin-left: 5px">
                    {{ item.label + '(' + item.count + ')' }}
                  </div>
                </div>
              </template>
            </el-select-v2>
          </el-form-item>
          <el-form-item label="查询方式">
            <el-radio-group v-model="form.simple" @change="buildConditions">
              <el-radio-button :label="true">简单</el-radio-button>
              <el-radio-button :label="false">聚合</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="超时时间(秒)">
            <el-input-number v-model="form.timeout" controls-position="right" :min="5" :max="180" @change="buildConditions"></el-input-number>
          </el-form-item>
          <el-form-item label="总数">
            <el-checkbox v-model="form.trackTotalHits" @change="buildConditions"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button v-if="form.simple" type="primary" @click="search" :disabled="!form.index" :icon="Search" :loading="loading">
              搜索
            </el-button>
            <el-button v-else type="primary" @click="search" :disabled="!form.index || Object.keys(aggregations).length===0" :icon="Search" :loading="loading">
              搜索
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="text" @click="showQuery">查询条件</el-button>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane label="查询条件">
        <Conditions :fields="fields" @query="onQueryChange"></Conditions>
      </el-tab-pane>
      <el-tab-pane label="字段设置" v-if="form.simple">
        <Fields :fields="fields" v-model:values="sourceFields" @change="onFieldChange"></Fields>
      </el-tab-pane>
      <el-tab-pane label="聚合查询" v-if="!form.simple">
        <Agg :fields="fields" @change="onAggChange"></Agg>
      </el-tab-pane>
    </el-tabs>
    <el-tabs>
      <el-tab-pane label="表格" v-if="form.simple">
        <div style="display:flex;justify-content: flex-end;margin: 5px">
          <FilterColumns :visible="isShowSelectColumn" :columns="columns" :filter-columns="filterColumns" :disabled="Object.keys(filterColumns).length===0" @change="onColumnChange"></FilterColumns>
          <el-button type="text" :loading="isDownloading" :icon="Download" :disabled="Object.keys(result).length===0" @click="downloadExcel"></el-button>
        </div>
        <div style="height:520px">
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table :data="rows" :height="height" border stripe table-layout="auto" highlight-current-row @row-dblclick="onRowdblClick" v-loading="loading">
                <el-table-column type="index" width="50px" align="center" v-if="Object.keys(filterColumns).length!==0"/>
                <template v-for="column in filterColumns">
                  <el-table-column sortable :prop="column.prop" :label="column.label" :min-width="column.width" :align="column.align" show-overflow-tooltip/>
                </template>
              </el-table>
            </template>
          </el-auto-resizer>
        </div>
        <div class="pagination">
          <el-pagination
              :current-page="page.pageNum"
              :page-sizes="[10, 15, 20, 50, 100,200,300]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next"
              :total="page.total"
              @size-change="query4Size"
              @current-change="query4Num"
          >
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="JSON">
        <div style="height: 500px;overflow: auto;padding: 2px;border: solid 1px var(--el-border-color);" v-loading="loading">
          <JsonText :value="result"></JsonText>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>

</style>