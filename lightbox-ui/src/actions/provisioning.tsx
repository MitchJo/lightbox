import { INIT_PROVISION, PROVISION_EVENTS } from "../constants";

export const initiateProvision = (payload: any) => ({
    type: INIT_PROVISION,
    payload
})

export const provisionEvents = (payload: any) => ({
    type: PROVISION_EVENTS,
    payload
})