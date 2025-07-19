import { createSlice } from "@reduxjs/toolkit"

interface BleDevicesState {
    devices: any[],
}

const initialState = { devices: [] } satisfies BleDevicesState as BleDevicesState;

const BleDevicesSlice = createSlice({
    name: "bleDevices",
    initialState,
    reducers: {

        setDevices(state, action) {
            const {id} = action.payload || {};
            
            if(!id) return state;
            if(state.devices.find((e: any) => e.id === id) ) return state;

            const devices = [...state.devices, action.payload]
            state = {...state, devices}
            return state;
        },
        
        resetDevices(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = BleDevicesSlice;

export const bleDevicesActions = actions;

export default reducer;