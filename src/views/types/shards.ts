export type ShardType = {
    prirep: string,
    shard: string,
    state: string,
}
export type Shard = {
    index: string,
    node: string,
    ip: string,
    docs: string,
    store: string,
    types: Array<ShardType>
}