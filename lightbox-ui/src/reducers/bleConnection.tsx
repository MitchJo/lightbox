import { createSlice } from "@reduxjs/toolkit"
import { BLE_SCANNING_STATUS, BLE_CONNECTION_STATUS, BLE_SUBSCRIPTION_STATUS, BLE_WRITE_STATUS } from "../constants";

interface BleState {
    connection: BLE_CONNECTION_STATUS,
    scan: BLE_SCANNING_STATUS,
    deviceId: string,
    serviceCharacteristics: any,
    subscriptionStatus: BLE_SUBSCRIPTION_STATUS,
    writeStatus: BLE_WRITE_STATUS
}

const initialState = { 
    connection: BLE_CONNECTION_STATUS.DISCONNECTED, 
    scan: BLE_SCANNING_STATUS.IDLE, 
    deviceId: '', 
    serviceCharacteristics: undefined, 
    subscriptionStatus: BLE_SUBSCRIPTION_STATUS.NOT_SUBSCRIBED,
    writeStatus: BLE_WRITE_STATUS.IDLE
} satisfies BleState as BleState

const BleSlice = createSlice({
    name: "ble",
    initialState,
    reducers: {

        setBleConnectionStatus(state, action) {
            state = { ...state, ...action.payload }
            return state;
        },

        setBleScanning(state, action) {
            state = { ...state, ...action.payload }
            return state;
        },

        setServiceCharacteristics(state, action) {
            console.log(action.payload)
            state = { ...state, ...action.payload }
            return state;
        },

        setSubscriptionStatus(state, action) {
            state = { ...state, ...action.payload }
            return state;
        },

        setWriteStatus(state, action) {
            state = { ...state, ...action.payload }
            return state;
        },

        resetBleStatus(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = BleSlice;

export const bleActions = actions;

export default reducer;