import {createRouter, createWebHashHistory} from 'vue-router'

import Home from "@/views/views/Home.vue"
import Node from "@/views/views/Node.vue"
import Index from "@/views/views/Index.vue"

const routes = [
    {path: '/home', name: "home", component: Home},
    {path: '/node', name: "node", component: Node},
    {path: '/index', name: "index", component: Index},
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes:routes,
});
