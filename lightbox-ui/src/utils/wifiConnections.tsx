import { eventChannel } from "redux-saga";


export function wifiConnect(data: any) {
    
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })
    
        const { onWifiConnect } = api;
        if (!onWifiConnect) reject({ message: 'API method "onWifiConnect" is not available' })
        
        onWifiConnect(data).then((s: any)=> resolve(s) ).catch((e: any)=> reject(e) );
        
    })

}


export function wifiScan() {
    
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })
    
        const { onWifiScan } = api;
        if (!onWifiScan) reject({ message: 'API method "onWifiScan" is not available' })
        
        onWifiScan().then((s: any)=> resolve(s) ).catch((e: any)=> reject(e) );
        
    })

}


export function wifiEventsChannel() {
    if (!window) return;

    const api = (window as any)?.versions;
    if (!api) return;

    const { onWifiEvents } = api;
    if (!onWifiEvents) return;


    const channel = eventChannel(emit => {

        onWifiEvents((value: any) => {
            if (!value) return;
            try {
                const parsedValue = JSON.parse(value)
                emit(parsedValue)
            } catch (e) {
                console.log(e)
            }
        })

        return () => { }
    })

    return channel;

}