import { WIFI_CONNECT, WIFI_EVENTS, WIFI_SCAN } from "../constants";

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