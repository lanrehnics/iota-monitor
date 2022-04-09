import path from 'path';

import { app, BrowserWindow, ipcMain } from 'electron';
import { mSubscribe, mUnSubscribe, mUnSubscribeAll } from './iota_mqtt';

const debug = /--debug/.test(process.argv[3]);

if (debug) require('electron-reload')(__dirname);

let window: BrowserWindow;


process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {
    window = new BrowserWindow({
        show: false,
        width: 1080,
        minWidth: 680,
        height: 840,
        title: app.getName(),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: false,
            enableWebSQL: false,
            sandbox: true,
        },
    });
    window.loadFile(path.join(__dirname, '..', 'index.html'));

    if (process.platform === 'linux') {
        window.setIcon(path.join(__dirname, '..', 'assets', 'iota.png'));
    }

    if (debug) {
        window.webContents.openDevTools();
    }

    window.once('ready-to-show', () => {
        window.show();
    });
}

const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
    app.quit();
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    mUnSubscribeAll();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.once('ready', () => {
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
app.on('second-instance', () => {
    if (window) {
        if (window.isMinimized()) {
            window.restore();
        }
        window.focus();
    }
});
ipcMain.on('subscribe', (event, [network, bechAddress]) => {
    mSubscribe(network, bechAddress, () => {
        window.webContents.send('activityOnAddress', { network, bechAddress });
    });
});
ipcMain.on('unsubscribe', (event, [network, bechAddress]) => {
    mUnSubscribe(network, bechAddress);
});
ipcMain.on('refresh', () => {
    window.webContents.reload();
});
