import { createSlice } from "@reduxjs/toolkit"
import { WIFI_CONNECTION_STATUS, WIFI_SCANNING_STATUS } from "../constants";

interface WifiState {
    connection: WIFI_CONNECTION_STATUS,
    scan: WIFI_SCANNING_STATUS,
    ssid: string,
    mac: string,
    power: boolean
}

const initialState = { connection: WIFI_CONNECTION_STATUS.DISCONNECTED, scan: WIFI_SCANNING_STATUS.IDLE, ssid: '', power: false, mac: '' } satisfies WifiState as WifiState

const WifiSlice = createSlice({
    name: "wifi",
    initialState,
    reducers: {

        setWifiConnectionStatus(state, action){
            state = {...state, ...action.payload}
            return state;
        },

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