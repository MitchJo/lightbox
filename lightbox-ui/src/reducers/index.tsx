import { combineReducers } from "@reduxjs/toolkit";

import ConfigurationReducer from './configurations';
import MqttStatusReducer from './mqtt';
import MqttLogsReducer from './mqttLogs';
import WifiConnectionReducer from './wifiConnections';
import WifiDevicesReducer from './wifiDevices';
import ProvisioningReducer from './provisioning';

const reducers = combineReducers({
    configurations: ConfigurationReducer,
    mqtt: MqttStatusReducer,
    mqttLogs: MqttLogsReducer,
    wifi: WifiConnectionReducer,
    wifiDevices: WifiDevicesReducer,
    provision: ProvisioningReducer
});

export default reducers;