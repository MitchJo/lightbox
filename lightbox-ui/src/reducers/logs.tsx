import { createSlice } from "@reduxjs/toolkit"

interface LogsState {
    value: string
}

const initialState = { value: '' } satisfies LogsState as LogsState

const LogsSlice = createSlice({
    name: "logs",
    initialState,
    reducers: {
        setLogs(state, action) {
            state = {...state, ...action.payload};
            return state;
        },
        resetLogs(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = LogsSlice;

export const logsActions = actions;

export default reducer;