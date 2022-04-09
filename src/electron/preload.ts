import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    send: (channel: string, data: any) => {
        let validChannels = ['subscribe', 'unsubscribe', 'refresh'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel: string, func: (arg0: any) => void) => {
        let validChannels = ['activityOnAddress'];
        if (validChannels.includes(channel)) {
            // @ts-ignore
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
});
