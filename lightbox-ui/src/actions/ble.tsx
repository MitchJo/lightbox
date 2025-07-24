import { BLE_CONNECT, BLE_DISCONNECT, BLE_EVENTS, BLE_START_SCAN, BLE_STOP_SCAN, BLE_SUBSCRIBE, BLE_UNSUBSCRIBE, BLE_WRITE } from "../constants";

export const bleStartScan = () => ({
    type: BLE_START_SCAN
})

export const bleStopScan = () => ({
    type: BLE_STOP_SCAN
})

export const bleConnect = (id: string) => ({
    type: BLE_CONNECT,
    id
})

export const bleDisconnect = () => ({
    type: BLE_DISCONNECT
})

export const listenToBleEvents = () => ({
    type: BLE_EVENTS
})

export const bleSubscribeToCharacteristic = (data: {service: string, characteristic: string}) => ({
    type: BLE_SUBSCRIBE,
    data
})

export const bleUnsubscribeFromCharacteristic = (data: {service: string, characteristic: string}) => ({
    type: BLE_UNSUBSCRIBE,
    data
})

export const bleWriteCharacteristic = (data: any) => ({
    type: BLE_WRITE,
    data
})