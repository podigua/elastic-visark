import {clipboard, ipcMain, shell} from "electron"

ipcMain.on('copy', (event, text) => {
    clipboard.writeText(text);
})