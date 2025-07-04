import { createSlice } from "@reduxjs/toolkit"
import { PROVISION_STATUS } from "../constants";

interface ProvisioningState {
    status: PROVISION_STATUS,
    message: string
}

const initialState = { status: PROVISION_STATUS.IDLE, message: '' } satisfies ProvisioningState as ProvisioningState

const ProvisioningSlice = createSlice({
    name: "provision",
    initialState,
    reducers: {
        setProvisionStatus(state, action) {
            state = {...state, ...action.payload};
            return state;
        },
        resetProvisionState(state, action) {
            state = { ...initialState }
            return state;
        }
    }
});

const { actions, reducer } = ProvisioningSlice;

export const provisionActions = actions;

export default reducer;