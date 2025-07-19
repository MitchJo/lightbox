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

  onWifiReset: () => ipcRenderer.invoke('wifi-reset', null),

  onWifiConnect: (data) => ipcRenderer.invoke('wifi-connect',data),

  onWifiEvents: (cb) => ipcRenderer.on('wifi-events', (_, value) => cb(JSON.stringify(value) ) ),

  getWifiState: () => ipcRenderer.invoke('wifi-state',{}),

  onProvisionInit: (data) => ipcRenderer.invoke('provision-init',data),


  readLogFile: () => ipcRenderer.invoke('logs-read', null),


  // ble connection handler

  bleStartScan: () => ipcRenderer.invoke('ble-start-scan', null),
  
  bleStopScan: () => ipcRenderer.invoke('ble-stop-scan', null),

  bleConnect: (id) => ipcRenderer.invoke('ble-connect', id),

  bleDisconnect: () => ipcRenderer.invoke('ble-disconnect', null),

  bleSubscribe: (data) => ipcRenderer.invoke('ble-subscribe', data),

  bleUnsubscribe: (data) => ipcRenderer.invoke('ble-unsubscribe', data),

  onBleEvents: (cb) => ipcRenderer.on('ble-events', (_, value) =>  cb(JSON.stringify(value) ) ),

})