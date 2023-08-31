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
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
app.use(router);
app.use(UUID);
import {heightLine} from "./directive/heightline.ts"

app.directive("height-line", heightLine);
app.use(ElementPlus, {size: 'small', locale: zhCn});
app.mount('#app').$nextTick(() => postMessage({payload: 'removeLoading'}, '*'))
