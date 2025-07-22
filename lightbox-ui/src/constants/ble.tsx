export const BLE_START_SCAN = "BLE_START_SCAN"
export const BLE_STOP_SCAN = "BLE_STOP_SCAN"
export const BLE_CONNECT = "BLE_CONNECT"
export const BLE_DISCONNECT = "BLE_DISCONNECT"

export const BLE_SUBSCRIBE = "BLE_SUBSCRIBE";
export const BLE_UNSUBSCRIBE = "BLE_UNSUBSCRIBE";

export const BLE_EVENTS = "BLE_EVENTS";

export const BLE_WRITE = "BLE_WRITE";

export const BLE_WRITABLE_CHARACTERISTIC = {
    serviceUUID: '00ff',
    characteristicUUID: 'ff01'
}

export enum BLE_SCANNING_STATUS{
    IDLE,
    SCANNING
}

export enum BLE_CONNECTION_STATUS{
    DISCONNECTED,
    CONNECTED,
    CONNECTING
}

export enum BLE_SUBSCRIPTION_STATUS{
    SUBSCRIBED,
    NOT_SUBSCRIBED,
    SUBSCRIBING
}

export enum BLE_WRITE_STATUS{
    IDLE,
    WRITING
}