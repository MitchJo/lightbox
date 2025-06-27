const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,

  onMqttStatus: (cb) => ipcRenderer.on('mqtt-status',(_, value) => cb(JSON.stringify(value)) ),

  mqttConnect: () => ipcRenderer.invoke('mqtt-connect', null),

  mqttDisconnect: () => ipcRenderer.invoke('mqtt-disconnect', null),

  mqttPublish: (data) => ipcRenderer.invoke('mqtt-publish', data),

  setConfiguration: (data) => ipcRenderer.invoke('set-configuration',data),

  getConfiguration: () => ipcRenderer.invoke('get-configuration',{})
})