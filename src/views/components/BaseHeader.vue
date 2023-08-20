<script lang="ts" setup>
import {ref} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute();
const visible = ref(false);
import Theme from '@/theme/Theme.vue'
import logo from '@/assets/logo.png';
import {useSiteStore} from '@/store/modules/site.ts'
import ElasticList from "@/views/components/ElasticList.vue";
import Point from "@/components/Point.vue";

const onConnecting = () => {
  visible.value = false;
}

</script>

<template>
  <div class="container">
    <div class="left">
      <div class="logo">
        <img :src="logo" width="40" height="40"/>
      </div>
      <div>
        <el-popover :visible="visible" :width="630" placement="bottom">
          <template #reference>
            <button class="select-button" @click="visible = !visible">
              <div style="display: flex;justify-content: flex-end;align-items: center">
                <div style="white-space: nowrap;overflow:hidden;max-width:180px">
                  <template v-if="useSiteStore().state">
                    <Point :color="useSiteStore().health"></Point>
                    <span style="margin-left: 5px; ">{{ useSiteStore().name }}</span>
                  </template>
                  <template v-else>
                    <span>请选择</span>
                  </template>
                </div>
                <div>
                  <el-icon class="el-icon--right">
                    <CaretBottom/>
                  </el-icon>
                </div>
              </div>
            </button>
          </template>
          <ElasticList @connecting="onConnecting"></ElasticList>
        </el-popover>
      </div>
    </div>
    <div class="right" style="width: 100%">
      <div style="width: 100%">
        <template v-if="useSiteStore().state">
          <el-menu
              style="--el-menu-border-color:#00000000"
              router
              :default-active="route.path"
              mode="horizontal"
          >
            <el-menu-item index="/home">首页</el-menu-item>
            <el-menu-item index="/node">节点</el-menu-item>
            <el-menu-item index="/shards">分片</el-menu-item>
            <el-menu-item index="/index">索引</el-menu-item>
            <el-menu-item index="/search">搜索</el-menu-item>
            <el-menu-item index="/rest">REST</el-menu-item>
            <el-menu-item index="/snapshot">快照</el-menu-item>
          </el-menu>
        </template>
      </div>
      <div style="display: flex;justify-content: flex-start">
        <Theme></Theme>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 1px #dcdfe6;
  height: 54px;
  line-height: 54px;
  padding: 0 20px 3px 20px;
}

.left {
  width: 300px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}

.right {
  display: flex;
  justify-content: flex-end;
}

.logo {
  display: flex;
  align-items: center;
  width: 60px;
}

.select-button {
  cursor: pointer;
  padding: 5px;
  min-width: 120px;
  max-width: 240px;
  text-align: right;
  background-color: #00000000;
  border: 0;
}

.select-button:hover {
  border-bottom: solid 1px var(--el-border-color);
}
</style>
