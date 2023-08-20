import {site} from '@/utils/auth.ts';
import {http} from '@/utils/http';

export const nodes = () => {
    if (!site().state) {
        console.log("state",site().state)
        return Promise.reject("");
    }
    return http.request("get", site().url);
}
export const health = () => {
    if (!site().state) {
        return Promise.reject("");
    }
    return http.request("get", site().url+"/_cluster/health");
}
export const nodeList = ():Promise<[]> => {
    if (!site().state) {
        return Promise.reject("");
    }
    return http.request("get", site().url+"/_cat/nodes?format=json&h=id,pid,ip,port,http_address,version,flavor,type,build,jdk,disk.total,disk.used,disk.avail,disk.used_percent,heap.current,heap.percent,heap.max,ram.current,ram.percent,ram.max,file_desc.current,file_desc.percent,file_desc.max,cpu,load_1m,load_5m,load_15m,uptime,node.role,master,name,completion.size,fielddata.memory_size,fielddata.evictions,query_cache.memory_size,query_cache.evictions,request_cache.memory_size,request_cache.evictions,request_cache.hit_count,request_cache.miss_count,flush.total,flush.total_time,get.current,get.time,get.total,get.exists_time,get.exists_total,get.missing_time,get.missing_total,indexing.delete_current,indexing.delete_time,indexing.delete_total,indexing.index_current,indexing.index_time,indexing.index_total,indexing.index_failed,merges.current,merges.current_docs,merges.current_size,merges.total,merges.total_docs,merges.total_size,merges.total_time,refresh.total,refresh.time,refresh.external_total,refresh.external_time,refresh.listeners,script.compilations,script.cache_evictions,script.compilation_limit_triggered,search.fetch_current,search.fetch_time,search.fetch_total,search.open_contexts,search.query_current,search.query_time,search.query_total,search.scroll_current,search.scroll_time,search.scroll_total,segments.count,segments.memory,segments.index_writer_memory,segments.version_map_memory,suggest.current,suggest.time,suggest.total");
}
export const indices = ():Promise<[]> => {
    if (!site().state) {
        return Promise.reject("");
    }
    return http.request("get", site().url+"/_cat/indices?format=json&h=index,health,pri,rep,docs.count,status,tm,uuid,store.size,memory.total,creation.date");
}