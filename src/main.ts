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

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


setupStore(app);


app.use(router);
app.use(ElementPlus, {size: 'small',locale:zhCn});
app.mount('#app').$nextTick(() => postMessage({payload: 'removeLoading'}, '*'))
