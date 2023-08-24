<script setup lang="ts">
import {Shard} from "@/views/types/shards.ts";
import {PropType} from "vue";

const props = defineProps({
  shard: {type: Object as PropType<Shard>, required: true}
})
</script>

<template>
  <div style="height:180px;margin:5px;border: 1px solid  var(--el-border-color);padding: 5px;">
    <el-descriptions :column="2" style="overflow: hidden">
      <template #title>
        <span style="text-overflow: ellipsis; white-space: nowrap;overflow: hidden" :title="shard.index">{{shard.index}}</span>
      </template>
      <el-descriptions-item label="节点">{{shard.node}}</el-descriptions-item>
      <el-descriptions-item label="IP">{{shard.ip}}</el-descriptions-item>
      <el-descriptions-item label="存储">{{shard.store}}</el-descriptions-item>
      <el-descriptions-item label="数量">{{shard.docs}}</el-descriptions-item>
    </el-descriptions>
    <div style="overflow: auto">
      <div style="display: flex;justify-content: flex-start;align-items: center">
        <template v-for="item in shard.types">
          <div v-if="item.prirep==='p'" :style="{padding:'5px',margin:'5px',width:'25px',border:'3px solid',borderColor:item.state==='STARTED'?'#6BFF84':'grey'}">
            {{ item.prirep + item.shard }}
          </div>
        </template>
      </div>
      <div style="display: flex;justify-content: flex-start;align-items: center">
        <template v-for="item in shard.types">
          <div v-if="item.prirep!=='p'"  :style="{padding:'5px',margin:'5px',width:'25px',border:'3px dashed',borderColor:item.state==='STARTED'?'#6BFF84':'grey'}">
            {{ item.prirep + item.shard }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>