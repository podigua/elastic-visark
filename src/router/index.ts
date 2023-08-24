import {createRouter, createWebHashHistory} from 'vue-router'

import Home from "@/views/views/Home.vue"
import Node from "@/views/views/Node.vue"
import Index from "@/views/views/Index.vue"
import Search from "@/views/views/Search.vue"
import Shards from "@/views/views/Shards.vue"
import Rest from "@/views/views/Rest.vue"

const routes = [
    {
        path: '/home', name: "home", meta: {
            transition: "out-in",
            keepAlive: true,
        }, component: Home
    },
    {
        path: '/node', name: "node", meta: {
            transition: "out-in", keepAlive: true
        }, component: Node
    },
    {
        path: '/shards', name: "shards", meta: {
            transition: "out-in", keepAlive: true
        }, component: Shards
    },
    {
        path: '/index', name: "index", meta: {
            transition: "out-in", keepAlive: true
        }, component: Index
    },
    {
        path: '/search', name: "search", meta: {
            transition: "out-in", keepAlive: true
        }, component: Search
    },
    {
        path: '/rest', name: "rest", meta: {
            transition: "out-in", keepAlive: true
        }, component: Rest
    },
]
export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
});
