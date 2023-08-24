<script setup lang="ts">
import BaseHeader from "@/views/components/BaseHeader.vue";
import {useSiteStore} from "@/store/modules/site.ts"
</script>
<template>
  <div>
    <BaseHeader/>
    <div class="flex main-container">
      <template v-if="useSiteStore().state">
        <router-view v-slot="{ Component,route }">
          <transition :name="route.meta.transition||'fade'">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </transition>
        </router-view>
      </template>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  padding: 5px;
  overflow-y: auto;
  max-height: calc(100vh - 67px);
}
</style>
<style>
.test {
  color: red;
}
</style>