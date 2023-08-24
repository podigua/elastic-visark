//@ts-nocheck
import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from "element-plus/dist/locale/zh-cn.mjs"

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "./styles/index.scss";
import "./assets/iconfont/iconfont.js"
import "./assets/iconfont/iconfont.css"
import {setupStore} from "./store"
import SvgIcon from "./components/SvgIcon.vue";
import {router} from "@/router"

const app = createApp(App);


app.component("svg-icon", SvgIcon);
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import UUID from "vue3-uuid"

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


setupStore(app);
import {JsonViewer} from "vue3-json-viewer";
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import "vue3-json-viewer/dist/index.css";

app.component("json-viewer", JsonViewer);
app.use(router);
app.use(UUID);


import Home from "@/views/views/Home.vue"
import Node from "@/views/views/Node.vue"
import Index from "@/views/views/Index.vue"
import Search from "@/views/views/Search.vue"
import Shards from "@/views/views/Shards.vue"
import Rest from "@/views/views/Rest.vue"
app.component(Home,Home);
app.component(Node,Node);
app.component(Index,Index);
app.component(Search,Search);
app.component(Shards,Shards);
app.component(Rest,Rest);
app.use(ElementPlus, {size: 'small', locale: zhCn});
app.mount('#app').$nextTick(() => postMessage({payload: 'removeLoading'}, '*'))
