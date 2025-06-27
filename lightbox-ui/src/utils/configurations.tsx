export function readConfigurations(): Promise<any>{
    return new Promise((resolve, reject) => {

        if(!window) reject({message: 'No window object'});

        const api = (window as any)?.versions;
        if(!api) reject({message: 'No API object available'})

        const {getConfiguration} = api;
        if(!getConfiguration) reject({message: 'API method "getConfiguration" is not available'})

        getConfiguration().then((s: any)=> resolve(s)).catch((e: any)=> reject({message: e?.message||'Could not read config'}))

    })
}


export function saveConfigurations(payload: any): Promise<any>{
    return new Promise((resolve, reject) => {

        if(!window) reject({message: 'No window object'});

        const api = (window as any)?.versions;
        if(!api) reject({message: 'No API object available'})

        const {setConfiguration} = api;
        if(!setConfiguration) reject({message: 'API method "setConfiguration" is not available'})

        setConfiguration(payload).then((s: any)=> resolve(s)).catch((e: any)=> reject({message: e?.message||'Could not save config'}))

    })
}