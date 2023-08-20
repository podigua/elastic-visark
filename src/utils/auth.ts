import {SiteInfo} from "@/store/modules/types.ts";
import {useSiteStore} from "@/store/modules/site.ts"
import {Base64} from "js-base64";

/**
 * 设置站点
 * @param app
 */
export const site = (): SiteInfo => {
    return {
        state: useSiteStore().state,
        name: useSiteStore().name,
        url: useSiteStore().url,
        username: useSiteStore().username,
        password: useSiteStore().password,
    }
}
/**
 * 获取请求头
 */
export const getAuthorization = () => {
    let username = useSiteStore().username;
    let password = useSiteStore().password;
    if (username && password) {
        return "Basic " + Base64.encode(username + ":" + password);
    }
    return "";
}