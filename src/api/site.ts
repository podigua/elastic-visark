import {SiteInfo} from "@/store/modules/types.ts";
import {http} from "@/utils/http"

export const getLogin = (data: SiteInfo) => {
    return http.request('get', <string>data.url);
}