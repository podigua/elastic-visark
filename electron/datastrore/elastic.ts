import Datastore from "nedb"
import os from "os"
import {ipcMain} from 'electron'
import path from "path"

let filename = path.join(os.homedir(), 'elastic-visark', 'data', 'elastic.db');
const elastics = new Datastore({
    autoload: true, filename: filename
})


/**
 *插入
 */
ipcMain.handle('elastic.insert', async (event, value) => {
    console.log("event", event)
    return new Promise((resolve, reject) => {
        delete value._id;
        elastics.insert(value, (err, doc) => {
            if (err) {
                reject(err);
            } else {
                resolve(doc);
            }
        })
    })
})

/**
 *更新
 */
ipcMain.handle('elastic.update', async (event, value) => {
    console.log("elastic.update", event.processId)
    return new Promise((resolve, reject) => {
        let target = Object.assign({}, value)
        console.log(target);
        delete target._id
        elastics.update({_id: value._id}, target, {}, (err) => {
            console.log("update", err)
            if (err) {
                reject(err);
            } else {
                resolve(1);
            }
        })
    })
})


/**
 *根据ID获取
 */
ipcMain.handle('elastic.getById', async (event, id) => {
    console.log("elastic.getById", event.processId)
    return new Promise((resolve, reject) => {
        elastics.findOne({_id: id}, (err, doc) => {
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
        elastics.remove({_id: id}, {}, (err, number) => {
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
ipcMain.handle('elastic.getAll', async (event) => {
    console.log("elastic.getAll", event.processId)
    return new Promise((resolve, reject) => {
        elastics.find({}).sort({time: 1}).exec((err, doc) => {
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
ipcMain.handle('elastic.deleteById', async (event, id) => {
    console.log("event", event)
    return deleteById(id);
})