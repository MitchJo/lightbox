export const readLogs = () => {
    return new Promise((resolve, reject) => {
        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { readLogFile } = api;
        if (!readLogFile) reject({ message: 'API method "readLogFile" is not available' })

        readLogFile().then((s: any)=> resolve(s)).catch((e: any)=> reject({message: e?.message ||'Could not read config'}))
    })
}