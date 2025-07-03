const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,

  //Mqtt handlers

  onMqttStatus: (cb) => ipcRenderer.on('mqtt-status',(_, value) => cb(JSON.stringify(value)) ),

  mqttConnect: () => ipcRenderer.invoke('mqtt-connect', null),

  mqttDisconnect: () => ipcRenderer.invoke('mqtt-disconnect', null),

  mqttPublish: (data) => ipcRenderer.invoke('mqtt-publish', data),
  
  // file handlers
  setConfiguration: (data) => ipcRenderer.invoke('set-configuration',data),

  getConfiguration: () => ipcRenderer.invoke('get-configuration',{}),

  // wifi connection handler
  onWifiScan: () => ipcRenderer.invoke('wifi-scan',{}),

  onWifiConnect: (data) => ipcRenderer.invoke('wifi-connect',data),

  onWifiEvents: (cb) => ipcRenderer.on('wifi-events', (_, value) => cb(JSON.stringify(value) ) ),

})