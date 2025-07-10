const { ipcMain } = require('electron')

const {mqttConstants, fileConstants, wifiConstants, logsConstants} = require("./constants");
const { mqttHelpers, configurationFiles, wifiConnectionHelpers, fileLogger } = require("./main");
const path = require('path')

exports.initializeHandlers = (app) => {
    const appDataPath = app.getPath('userData');
    const appFilesDir = path.join(appDataPath, 'app_files');

    fileLogger.setLogDir(appFilesDir);

    ipcMain.handle(mqttConstants.MqttConnect, async (event, data) => {
        const params = await configurationFiles.getConfigurations(appFilesDir);
        try {
            return mqttHelpers.mqttConnect(params);
        } catch (error) {
            console.error('[Main Process] Error executing Node function:', error);
            throw new Error(`Failed to execute Node function: ${error.message}`);
        }

    });

    ipcMain.handle(mqttConstants.MqttPublish, async (event, data) => {
        try {
            return mqttHelpers.mqttPublish(data);
        } catch (error) {
            console.error('[Main Process] Error executing Node function:', error);
            throw new Error(`Failed to execute Node function: ${error.message}`);
        }

    });

    ipcMain.handle(mqttConstants.MqttDisConnect, async (event, data) => {

        try {
            return mqttHelpers.mqttDisconnect();
        } catch (error) {
            console.error('[Main Process] Error executing Node function:', error);
            throw new Error(`Failed to execute Node function: ${error.message}`);
        }

    });


    ipcMain.handle(fileConstants.setConfiguration, async (event, params) => {

        try {
            return configurationFiles.setConfigurations(appFilesDir, params);
        } catch (error) {
            console.error('[Main Process] Error executing Node function:', error);
            throw new Error(`Failed to execute Node function: ${error.message}`);
        }

    });

    ipcMain.handle(fileConstants.getConfiguration, async (event, data) => { 
        try {
            return configurationFiles.getConfigurations(appFilesDir);
        } catch (error) {
            console.error('[Main Process] Error executing Node function:', error);
            throw new Error(`Failed to execute Node function: ${error.message}`);
        }
    });


    ipcMain.handle(wifiConstants.wifiConnect, async(event, data) => {
        try{
            return wifiConnectionHelpers.connectToWifi(data);
        }catch(e){
            throw new Error(e.message||'Cannot connect to WiFi');
        }
    });

    ipcMain.handle(wifiConstants.wifiScan, async(event, data) => {
        try{
            return wifiConnectionHelpers.scanWifi();
        }catch(e){
            throw new Error(e.message||'Cannot scan WiFi networks');
        }
    });

    ipcMain.handle(wifiConstants.wifiState, async (event, data) => {
        try{
            return await wifiConnectionHelpers.getCurrentWifi();
        }catch(e){
            throw new Error(e.message|| 'Cannot get Wifi State');
        }
    })

    ipcMain.handle(wifiConstants.wifiReset,(event,data) => {
        try{
            return wifiConnectionHelpers.resetWifi();
        }catch(e){
            throw new Error(e.message|| 'Cannot reset Wifi');
        }
    })

    ipcMain.handle(wifiConstants.initiateProvision, async (event, payload) => {
        try{
            return await wifiConnectionHelpers.initateDeviceProvision(payload)
        }catch(e){
            throw new Error(e.message);
        }

    })


    ipcMain.handle(logsConstants.readLogs, async (event, payload) => {
        try{
            return fileLogger.readLogs(appFilesDir, 'logs.txt')
        }catch(e){
            throw new Error(e.message);
        }

    })

}