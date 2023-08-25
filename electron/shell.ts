import {shell, ipcMain} from "electron"

/**
 * open
 */
ipcMain.on('open', (event, url) => {
    shell.openExternal(url);
})