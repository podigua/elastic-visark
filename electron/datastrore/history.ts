import Datastore from "nedb"
import os from "os"
import {ipcMain} from 'electron'
import path from "path"

let filename = path.join(os.homedir(), 'elastic-visark', 'data', 'history.db');
const histories = new Datastore({
    autoload: true, filename: filename
})


/**
 *插入
 */
ipcMain.handle('history.insert', async (event, value) => {
    console.log("event", event)
    return new Promise((resolve, reject) => {
        delete value._id;
        histories.insert(value, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        })
    })
})
const deleteById = async (id: string) => {
    return new Promise((resolve, reject) => {
        console.log("根据ID删除", id);
        histories.remove({_id: id}, {}, (err, number) => {
            if (err) {
                reject(err);
            } else {
                resolve(number);
            }
        })
    })
}
/**
 *获取全部
 */
ipcMain.handle('history.getList', async (event, siteId) => {
    console.log("elastic.getList", event.processId, siteId)
    return new Promise((resolve, reject) => {
        histories.find({siteId: siteId}).sort({time: 1}).exec((err, doc) => {
            if (err) {
                reject(err);
            } else {
                console.log("doc", doc);
                resolve(doc);
            }
        })
    })
})

/**
 * 根据ID删除
 */
ipcMain.handle('history.deleteById', async (event, id) => {
    console.log("event", event)
    return deleteById(id);
})

const deleteByTime = () => {
    histories.remove({time: {$lt: new Date().getTime() - 1000 * 60 * 60 * 24 * 30}}, {}, (err, number) => {
        console.log("删除历史记录", number)
    })
}

deleteByTime();