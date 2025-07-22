import { eventChannel } from "redux-saga";

export function bleStartScan() {
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { bleStartScan: startScan } = api;
        if (!startScan) reject({ message: 'API method "bleStartScan" is not available' })

        startScan().then((s: any)=> resolve(s) ).catch((e: any) => reject(e));
    });
}


export function bleStopScan() {
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { bleStopScan: stopScan } = api;
        if (!stopScan) reject({ message: 'API method "bleStopScan" is not available' })

        stopScan().then((s: any)=> resolve(s) ).catch((e: any) => reject(e));
    });
}


export function bleConnect(id: string) {
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { bleConnect: bleConnectDevice } = api;
        if (!bleConnectDevice) reject({ message: 'API method "bleConnect" is not available' })

        bleConnectDevice(id).then((s: any)=> resolve(s) ).catch((e: any) => reject(e));
    });
}

export function bleDisconnect() {
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { bleDisconnect: bleDisconnectDevice } = api;
        if (!bleDisconnectDevice) reject({ message: 'API method "bleDisconnect" is not available' })

        bleDisconnectDevice().then((s: any)=> resolve(s) ).catch((e: any) => reject(e));
    });
}

export function bleSubscribe(data: any) {
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { bleSubscribe: bleSubscribeCharacteristics } = api;
        if (!bleSubscribeCharacteristics) reject({ message: 'API method "bleSubscribe" is not available' })

        bleSubscribeCharacteristics(data).then((s: any)=> resolve(s) ).catch((e: any) => reject(e));
    });
}

export function bleUnsubscribe(data: any) {
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { bleUnsubscribe: bleUnsubscribeCharacteristics } = api;
        if (!bleUnsubscribeCharacteristics) reject({ message: 'API method "bleUnsubscribe" is not available' })

        bleUnsubscribeCharacteristics(data).then((s: any)=> resolve(s) ).catch((e: any) => reject(e));
    });
}

export function bleWrite(data: any) {
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { bleWrite: bleWriteCharacteristic } = api;
        if (!bleWriteCharacteristic) reject({ message: 'API method "bleWrite" is not available' })

        bleWriteCharacteristic(data).then((s: any)=> resolve(s) ).catch((e: any) => reject(e));
    });
}


export function bleEventsChannel() {
    if (!window) return;

    const api = (window as any)?.versions;
    if (!api) return;

    const { onBleEvents } = api;
    if (!onBleEvents) return;

    const channel = eventChannel(emit => {

        onBleEvents((value: any) => {
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
