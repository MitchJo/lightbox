import { createSlice } from "@reduxjs/toolkit"
import { BLE_SCANNING_STATUS, BLE_CONNECTION_STATUS, BLE_SUBSCRIPTION_STATUS, BLE_WRITE_STATUS, BLE_ADAPTER_STATE } from "../constants";

interface BleState {
    adapterState: BLE_ADAPTER_STATE,
    connection: BLE_CONNECTION_STATUS,
    scan: BLE_SCANNING_STATUS,
    deviceId: string,
    serviceCharacteristics: any,
    subscriptionStatus: BLE_SUBSCRIPTION_STATUS,
    writeStatus: BLE_WRITE_STATUS
}

const initialState = { 
    adapterState: BLE_ADAPTER_STATE.INVALID,
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

        setAdapterState(state, action){
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