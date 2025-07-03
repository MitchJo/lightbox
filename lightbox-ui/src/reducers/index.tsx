import { combineReducers } from "@reduxjs/toolkit";

import ConfigurationReducer from './configurations';
import MqttStatusReducer from './mqtt';
import MqttLogsReducer from './mqttLogs';
import WifiConnectionReducer from './wifiConnections';

const reducers = combineReducers({
    configurations: ConfigurationReducer,
    mqtt: MqttStatusReducer,
    mqttLogs: MqttLogsReducer,
    wifi: WifiConnectionReducer
});

export default reducers;