import { createSlice } from "@reduxjs/toolkit"

interface WifiDevicesState {
    devices: any[],
}

const initialState = { devices: [] } satisfies WifiDevicesState as WifiDevicesState

const WifiDevicesSlice = createSlice({
    name: "wifiDevices",
    initialState,
    reducers: {

        setDevices(state, action) {
            state = {...state, devices: action.payload}
            return state;
        },
        
        resetDevices(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = WifiDevicesSlice;

export const WifiDevicesActions = actions;

export default reducer;