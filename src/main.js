const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize electron-store
const store = new Store();

// Enable secure state restoration for macOS
if (process.platform === 'darwin') {
    app.applicationSupportsSecureRestorableState = true;
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    });

    // Load the index.html file
    win.loadFile(path.join(__dirname, '../index.html'));

    // Always open DevTools for debugging
    win.webContents.openDevTools();
}

// Handle IPC events
ipcMain.handle('get-habits', () => {
    return store.get('habits', []);
});

ipcMain.handle('save-habits', (event, habits) => {
    store.set('habits', habits);
    return true;
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}); 