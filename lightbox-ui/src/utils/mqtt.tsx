import { eventChannel } from "redux-saga";

export function mqttConnect(): Promise<any> {
    return new Promise((resolve, reject) => {

        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { mqttConnect } = api;
        if (!mqttConnect) reject({ message: 'API method "mqttConnect" is not available' })

        mqttConnect().then((s: any) => resolve(s)).catch((e: any) => reject({ message: e?.message || 'Could not execute MQTT Connect' }))

    })
}


export function mqttDisconnect(): Promise<any> {
    return new Promise((resolve, reject) => {

        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { mqttDisconnect } = api;
        if (!mqttDisconnect) reject({ message: 'API method "mqttDisconnect" is not available' })

        mqttDisconnect().then((s: any) => resolve(s)).catch((e: any) => reject({ message: e?.message || 'Could not execute MQTT Disconnect' }))

    })
}

export function mqttPublish(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {

        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { mqttPublish } = api;
        if (!mqttPublish) reject({ message: 'API method "mqttPublish" is not available' })

        mqttPublish(payload).then((s: any) => resolve(s)).catch((e: any) => reject({ message: e?.message || 'Could not execute MQTT Publish' }))

    })
}

export function mqttEventsChannel() {
    if (!window) return;

    const api = (window as any)?.versions;
    if (!api) return;

    const { onMqttStatus } = api;
    if (!onMqttStatus) return;

    const channel = eventChannel(emit => {

        onMqttStatus((value: any) => {
            if(!value) return;
            try{
                const parsedValue = JSON.parse(value)
                emit(parsedValue)
            }catch(e){
                console.log(e)
            }
        })

        return () => { }
    })

    return channel;
}