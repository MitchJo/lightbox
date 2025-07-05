export function initiateProvision(data: any): Promise<any> {
    return new Promise((resolve, reject) => {

        if (!window) reject({ message: 'No window object' });

        const api = (window as any)?.versions;
        if (!api) reject({ message: 'No API object available' })

        const { onProvisionInit } = api;
        if (!onProvisionInit) reject({ message: 'API method "onProvisionInit" is not available' })


        onProvisionInit(data).then((s: any) => resolve(s)).catch((e: any) => reject(e))

    })
}