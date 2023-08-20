export type KeyValue = {
    key: string,
    value: any
}
/**
 * 构建
 * @param data
 * @param parent
 * @param array
 */
export const build = (data: any, parent: string, array: Array<KeyValue>) => {
    if (data && Object.keys(data).length > 0) {
        for (const k in data) {
            let key = parent ? (parent + '.' + k) : k;
            let value = data[k];
            if (value instanceof Object) {
                build(data[k], key, array);
            }else{
                array.push({key, value})
            }
        }
    }
};