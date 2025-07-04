import { WIFI_CONNECT, WIFI_EVENTS, WIFI_RESET, WIFI_SCAN, WIFI_STATE } from "../constants";

export const wifiConnect = (payload: any) => ({
    type: WIFI_CONNECT,
    payload
})

export const wifiScan = () => ({
    type: WIFI_SCAN
})


export const wifiEvents = () => ({
    type: WIFI_EVENTS
})

export const getWifiState = () => ({
    type: WIFI_STATE
})

export const resetWifi = () => ({
    type: WIFI_RESET
})