<script setup lang="ts">
import BaseHeader from "@/views/components/BaseHeader.vue";
import {useSiteStore} from "@/store/modules/site.ts"
// import logo from "@/assets/logo.svg"
// import {ref} from 'vue';
//
// const logo = ref(logo);
const quit = () => {
  useSiteStore().$reset();
}
const test = () => {
  // let app = {
  //   name: "测试环境",
  //   url: "http://39.99.231.105:9201",
  //   username: "",
  //   password: "",
  // }
  let app = {
    name: "测试环境",
    url: "http://192.168.1.152:9200",
    username: "elastic",
    password: "3edc$RFV",
  }
  useSiteStore().login(app).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}
</script>
<template>
  <div>
    <BaseHeader/>
    <div class="flex main-container">
      <template v-if="useSiteStore().state">
        <router-view></router-view>
      </template>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  padding:5px;
  overflow-y: auto;
  max-height: calc(100vh - 64px - 3px);
}
</style>
<style>
.test {
  color: red;
}
</style>