import {app, BrowserWindow} from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let willQuitApp = false;

let window: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
import "./notification.ts"
import "./datastrore/index.ts"
function createWindow() {
    window = new BrowserWindow({
        icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
        minWidth: 900,
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    })
    window.webContents.on('did-finish-load', () => {
        window?.webContents.send('main-process-message', (new Date).toLocaleString())
    })
    window.maximize();
    if (VITE_DEV_SERVER_URL) {
        window.loadURL(VITE_DEV_SERVER_URL)
    } else {
        window.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

app.on('window-all-closed', () => {
    window = null
})

app.on('activate', () => window && window.show());
app.on('before-quit', () => {
    return willQuitApp = true;
});
app.whenReady().then(() => {
    createWindow();
    window && window.on('close', (e) => {
        if (willQuitApp) {
            window = null;
        } else {
            e.preventDefault();
            window && window.hide();
        }
    });
})
