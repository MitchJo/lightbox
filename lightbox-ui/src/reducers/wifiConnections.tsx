import { createSlice } from "@reduxjs/toolkit"
import { WIFI_CONNECTION_STATUS } from "../constants";

interface WifiState {
    status: WIFI_CONNECTION_STATUS,
    connectedSSID: string,
    devices: string[]
}

const initialState = { status: WIFI_CONNECTION_STATUS.NOT_CONNECTED, connectedSSID: '', devices: [] } satisfies WifiState as WifiState

const WifiSlice = createSlice({
    name: "wifi",
    initialState,
    reducers: {

        setDevices(state, action) {
            state = {...state, devices: action.payload}
            return state;
        },

        setWifiStatus(state, action) {
            state = {...state, status: action.payload};
            return state;
        },
        
        resetWifiStatus(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = WifiSlice;

export const wifiActions = actions;

export default reducer;