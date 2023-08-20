import {defineStore} from "pinia";
import {SiteInfo} from './types.ts'
import {store} from "@/store"
import {getLogin} from "@/api/site.ts"

const siteStore = defineStore("app-info", {
    state: (): SiteInfo => ({
        state: false,
        _id: "",
        name: "",
        url: "",
        username: "",
        password: "",
        health: "",
    }),
    actions: {
        app(info: SiteInfo) {
            this.state = false;
            this._id = info._id;
            this.name = info.name
            this.url = info.url
            this.username = info.username
            this.password = info.password
        },
        success() {
            this.state = true;
        },
        setHealth(health: string) {
            this.health = health;
        },
        async login(data: any) {
            this.app(data);
            return new Promise((resolve, reject) => {
                getLogin(data).then(res => {
                    resolve(res)
                    this.success();
                }).catch(err => {
                    this.$reset();
                    reject(err);
                })
            })
        }
    }
});

export function useSiteStore() {
    return siteStore(store);
}
