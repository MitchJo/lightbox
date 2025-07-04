export function initiateProvision(data: any, provisionUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const { host, port, privateKey, rootCa, deviceCert, ssid, password } = data;

        if (!ssid) reject('SSID is missing.');
        if (!password) reject('Password is missing.');

        if (!host) reject('Host is missing.');
        if (!port) reject('Port is missing.');
        if (!privateKey) reject('Private Key is missing.');
        if (!rootCa) reject('Root CA is missing.');
        if (!deviceCert) reject('Device Certitifate is missing.');


        const payload = new URLSearchParams();

        payload.append('wifiSsid', ssid);
        payload.append('wifiPassword', password);
        payload.append('mqttHost', host);
        payload.append('mqttPort', port);
        payload.append('mqttPrivateKey', privateKey);
        payload.append('mqttClientCert', deviceCert);
        payload.append('mqttCaCert', rootCa);

        console.log(payload);


        // fetch(provisionUrl, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: payload,
        // })
        //     .then(response => {
        //         if(response.status !== 200) reject('Could not provision')
        //         return response.text();
        //     })
        //     .then(data => resolve(data) )
        //     .catch(error => reject(error) );


    })
}