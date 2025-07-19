import { combineReducers } from "@reduxjs/toolkit";

import ConfigurationReducer from './configurations';
import MqttStatusReducer from './mqtt';
import MqttLogsReducer from './mqttLogs';
import WifiConnectionReducer from './wifiConnections';
import WifiDevicesReducer from './wifiDevices';
import ProvisioningReducer from './provisioning';
import LogsReducer from './logs';
import BleReducer from './bleConnection';
import BleDevicesReducer from './bleDevices';

const reducers = combineReducers({
    configurations: ConfigurationReducer,
    mqtt: MqttStatusReducer,
    mqttLogs: MqttLogsReducer,
    wifi: WifiConnectionReducer,
    wifiDevices: WifiDevicesReducer,
    provision: ProvisioningReducer,
    logs: LogsReducer,
    ble: BleReducer,
    bleDevices: BleDevicesReducer
});

export default reducers;