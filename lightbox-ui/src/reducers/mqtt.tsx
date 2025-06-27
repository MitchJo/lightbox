import { createSlice } from "@reduxjs/toolkit"
import { MQTT_CONNECTION_STATUS } from "../constants";

interface MqttState {
    status: MQTT_CONNECTION_STATUS
}

const initialState = { status: MQTT_CONNECTION_STATUS.DISCONNECTED } satisfies MqttState as MqttState

const MqttSlice = createSlice({
    name: "mqtt",
    initialState,
    reducers: {
        setMqttStatus(state, action) {
            state = {...state, status: action.payload};
            return state;
        },
        resetMqttStatus(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = MqttSlice;

export const mqttActions = actions;

export default reducer;