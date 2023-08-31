<script setup lang="ts">
import {CopyDocument, Download} from "@element-plus/icons-vue";
import {ref, watch, onMounted, toRaw} from "vue";
import {success} from "@/utils/message.ts";
const props = defineProps({
  value: {type: Object},
})
const isDownloading = ref(false);
const backups = ref("")
const text = ref("")
watch(() => props.value, (value) => {
  if (Object.keys(value).length > 0) {
    text.value = JSON.stringify(value, null, 2);
    backups.value = text.value;
  }
}, {deep: true})
onMounted(() => {
  if (Object.keys(props.value).length > 0) {
    text.value = JSON.stringify(toRaw(props.value), null, 2);
    backups.value = text.value;
  }
})
const filterText = ref("");
let textRef = ref<HTMLTextAreaElement>();
const copy = () => {
  window.api.copy(backups.value);
  success("复制成功");
}
const download = () => {
  let filename=`data-${new Date().getTime()}.json`
  window.api.openSaveFolder(filename).then(res => {
    let canceled = res.canceled
    if (!canceled) {
      window.api.export.text(res.filePath, '', backups.value).then(res => {
        success("下载完成")
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
  <div style="width: 100%;height: 100%;position: relative">
    <div class="tools-box">
      <el-input style="width: 220px;" v-model="filterText" placeholder="过滤..." clearable></el-input>
      <el-button-group>
        <el-button type="text" style="padding: 5px" :icon="CopyDocument" @click="copy"></el-button>
        <el-button type="text" style="padding: 5px" :icon="Download" @click="download" :loading="isDownloading"></el-button>
      </el-button-group>
    </div>
    <pre><div v-height-line:[backups]="filterText" ref="textRef" readonly class="json-view" v-html="text"></div></pre>
  </div>
</template>

<style scoped>
.json-view {
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  resize: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.tools-box {
  position: absolute;
  top: 5px;
  right: 10px;
}

.tools-box:hover {
  //opacity: 1;
}
</style>