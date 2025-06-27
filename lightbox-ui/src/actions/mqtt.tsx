import { MQTT_CONNECT, MQTT_DISCONNECT, MQTT_EVENTS, MQTT_PUBLISH, MQTT_STATUS } from "../constants";

export const mqttConnect = () => ({
    type: MQTT_CONNECT
})

export const mqttDisconnect = () => ({
    type: MQTT_DISCONNECT
})

export const mqttPublish = (payload: {topic: string, payload: any}) => ({
    type: MQTT_PUBLISH,
    payload
})

export const mqttStatus = (payload: any) => ({
    type: MQTT_STATUS,
    payload
})

export const mqttEvents = () => ({
    type: MQTT_EVENTS
})