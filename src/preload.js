const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        getHabits: () => ipcRenderer.invoke('get-habits'),
        saveHabits: (habits) => ipcRenderer.invoke('save-habits', habits)
    }
); 