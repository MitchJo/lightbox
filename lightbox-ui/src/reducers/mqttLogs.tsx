import { createSlice } from "@reduxjs/toolkit"

interface MqttLogsState {
    logs: string[]
}

const initialState = { logs: [] } satisfies MqttLogsState as MqttLogsState

const MqttLogsSlice = createSlice({
    name: "mqttLogs",
    initialState,
    reducers: {
        setMqttStatus(state, action) {
            state = {...state, ...action.payload};
            return state;
        },
        resetMqttState(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = MqttLogsSlice;

export const mqttLogsActions = actions;

export default reducer;