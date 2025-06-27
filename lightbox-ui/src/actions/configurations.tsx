import { READ_CONFIG, SAVE_CONFIG } from "../constants";

export const saveConfig = (payload: any) => ({
    type: SAVE_CONFIG,
    payload
});

export const readConfig = () => ({
    type: READ_CONFIG
});