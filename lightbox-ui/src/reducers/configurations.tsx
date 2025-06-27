import { createSlice } from "@reduxjs/toolkit"

interface ConfigurationState {
    protocol: string,
    host: string,
    port: number,
    privateKey: string,
    rootCa: string,
    deviceCert: string
}

const initialState = { protocol: 'mqtts', host: '', port: 8883, privateKey: '', rootCa: '', deviceCert: '' } satisfies ConfigurationState as ConfigurationState

const ConfigurationSlice = createSlice({
    name: "configurations",
    initialState,
    reducers: {
        setConfig(state, action) {
            state = {...state, ...action.payload};
            return state;
        },
        resetConfig(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = ConfigurationSlice;

export const configActions = actions;

export default reducer;