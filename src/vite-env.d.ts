/// <reference types="vite/client" />
/// <reference path="../types/open-graph-scraper.d.ts" />
declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}