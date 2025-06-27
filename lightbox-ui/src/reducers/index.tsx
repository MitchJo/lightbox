import { combineReducers } from "@reduxjs/toolkit";

import ConfigurationReducer from './configurations';
import MqttStatusReducer from './mqtt';
import MqttLogsReducer from './mqttLogs';

const reducers = combineReducers({
    configurations: ConfigurationReducer,
    mqtt: MqttStatusReducer,
    mqttLogs: MqttLogsReducer
});

export default reducers;