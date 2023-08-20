import {Notification, ipcMain} from 'electron'

/**
 * 发送普通通知
 */
ipcMain.handle('notice.show', async (event, title, body) => {
    console.log(event.processId)
    return new Promise<boolean>((resolve) => {
        if (Notification.isSupported()) {
            new Notification({
                title: title,
                body: body
            }).show()
            return resolve(true);
        }
        resolve(false);
    })
})