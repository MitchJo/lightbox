import { createSlice } from "@reduxjs/toolkit"
import { WIFI_SCANNING_STATUS } from "../constants";

interface WifiState {
    connection: string,
    scan: WIFI_SCANNING_STATUS,
    ssid: string,
    power: boolean
}

const initialState = { connection: "disconnected", scan: WIFI_SCANNING_STATUS.IDLE, ssid: '', power: false } satisfies WifiState as WifiState

const WifiSlice = createSlice({
    name: "wifi",
    initialState,
    reducers: {

        setWifiStatus(state, action) {
            state = {...state, ...action.payload};
            return state;
        },

        setWifiScanning(state, action) {
            state = {...state, ...action.payload}
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