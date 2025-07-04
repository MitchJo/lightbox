import { Component, createEffect, createSignal, on, Show } from "solid-js";
import './style.css';
import FormFileInput from "../FormFileInput";

interface IConfigurationForm {
    onFormSubmit: (data: any) => void;
    onClose: () => void;
    formValues: {
        protocol: string,
        host: string,
        port: number,
        privateKey: string,
        rootCa: string,
        deviceCert: string
    },
    closeLabel?: string;
    configFileReadTypes?: string;
    provisionForm?: boolean;
}

const ConfigurationForm: Component<IConfigurationForm> = (props: IConfigurationForm) => {


    const readFile = (file: File) => {
        return new Promise((resolve, reject) => {

            if (file.size > 100 * 1024 * 1024) {
                return reject(new Error(`File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Max 100 MB allowed.`));
            }

            const reader = new FileReader();
            reader.onload = (e: any) => resolve(e.target.result);
            reader.onerror = (error) => reject(error);

            if (props.configFileReadTypes === 'text') {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }

        });

    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        let data: { [k: string]: any } = {};
        let files: { [k: string]: any } = [];

        for (const [key, value] of formData.entries()) {
            if (value instanceof File && value.size > 0) {
                files.push({ key, file: value });
            } else {
                data[key] = value instanceof File ? '' : value;
            }
        }

        try {
            const readPromises = files.map(async ({ key, file }: any) => {
                const arrayBuffer = await readFile(file);
                return {
                    formKey: key,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    data: arrayBuffer
                };
            });

            const processedFiles = await Promise.all(readPromises);

            processedFiles.forEach((e) => {
                data = { ...data, [e.formKey]: e.data }
            })

            console.log('Form submission...')

            props.onFormSubmit(data);

        } catch (e) {
            console.log(e)
        }

    }

    return <div class="config-form-container">
        <form action="#" onSubmit={handleSubmit}>

            <fieldset class="row">
                <select name="protocol" tabindex="1">
                    <option value="mqtts" selected={props.formValues.protocol === 'mqtts'}>MQTTS://</option>
                    <option value="wss" selected={props.formValues.protocol === 'wss'}>WSS://</option>
                </select>

                <input type="text" name="host" required placeholder="host" tabindex="2" value={props.formValues.host} />
                <input type="number" name="port" required placeholder="port" tabindex="3" value={props.formValues.port} />
            </fieldset>

            <fieldset class="row">
                <label for="">Private key:</label>
                <FormFileInput fileType=".pem, application/x-pem-file" parameters={{ tabindex: 4, name: 'privateKey' }} filePath={props.formValues.privateKey} />
            </fieldset>

            <fieldset class="row">
                <label for="">Root CA:</label>
                <FormFileInput fileType=".pem, application/x-pem-file" parameters={{ tabindex: 5, name: 'rootCa' }} filePath={props.formValues.rootCa} />
            </fieldset>

            <fieldset class="row">
                <label for="">Device Cert:</label>
                <FormFileInput fileType="application/x-x509-ca-cert, .crt" parameters={{ tabindex: 6, name: 'deviceCert' }} filePath={props.formValues.deviceCert} />
            </fieldset>

            <Show when={props?.provisionForm}>
                <fieldset class="row">
                    <label for="">Wi-Fi SSID:</label>
                    <input type="text" name="ssid" required placeholder="Wifi SSID" />
                </fieldset>

                <fieldset class="row">
                    <label for="">Wi-Fi Password:</label>
                    <input type="text" name="password" required placeholder="WiFi Password" />
                </fieldset>
            </Show>

            <fieldset class="row submit">
                <input type="submit" value="Save" tabindex="7" />
                <button type="button" tabindex="8" class="border border-primary" onClick={props.onClose}>{props?.closeLabel || 'Close'}</button>
            </fieldset>

        </form>
    </div>
}

export default ConfigurationForm;