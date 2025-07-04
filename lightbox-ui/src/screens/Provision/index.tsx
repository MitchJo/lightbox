import { Component, createEffect, createSignal, on, onMount, Show } from "solid-js";

import './style.css';
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { getWifiState, wifiScan, wifiConnect, resetWifi, initiateProvision } from "../../actions";
import DeviceList from "../../components/DeviceLists";
import ConfigurationForm from "../../components/ConfigurationForm";
import { PROVISION_STATUS, WIFI_CONNECTION_STATUS, WIFI_SCANNING_STATUS } from "../../constants";

const Provision: Component = () => {

    const [
        { wifi, wifiDevices, provision },
        { onWifiScan, onGetWifiState, onWifiConnect, onWifiReset, onInitiateProvision }
    ] = useRedux(sagaStore, {
        onWifiScan: wifiScan,
        onGetWifiState: getWifiState,
        onWifiConnect: wifiConnect,
        onWifiReset: resetWifi,
        onInitiateProvision: initiateProvision
    });


    const onDeviceSelected = (e: any) => {
        onWifiConnect({ ssid: e.ssid });
    }

    const onFormSubmit = (e: any) => {
        onInitiateProvision(e);
    }

    onMount(() => {
        onGetWifiState();
    });

    return <div class="provision-container">

        <Show when={wifi.power}>

            <Show when={wifi.connection !== WIFI_CONNECTION_STATUS.CONNECTING && wifi.connection !== WIFI_CONNECTION_STATUS.CONNECTED}>
                <div class="row">
                    <button class="border border-primary" onClick={() => onWifiScan()} disabled={wifi.scan === WIFI_SCANNING_STATUS.SCANNING}>Scan</button>
                    <button class="primary" onClick={() => onWifiReset()}>Reset Wi-Fi</button>
                </div>
            </Show>


            <Show when={wifi.connection !== WIFI_CONNECTION_STATUS.CONNECTED}>
                <span class="note">If you could not connect to the device. Close the app and RUN it AS Administrator</span>
                <DeviceList devices={wifiDevices.devices} onClick={onDeviceSelected} connection={wifi.connection} ssid={wifi.ssid} />
            </Show>

            <Show when={wifi.connection === WIFI_CONNECTION_STATUS.CONNECTED}>
                <h3>Provisioning : {wifi.ssid}</h3>

                <Show when={provision.status === PROVISION_STATUS.IDLE}>
                    <ConfigurationForm onFormSubmit={onFormSubmit} configFileReadTypes="text" onClose={() => onWifiReset()} formValues={{
                        protocol: 'mqtts',
                        host: '',
                        port: 8883,
                        privateKey: '',
                        rootCa: '',
                        deviceCert: ''
                    }} closeLabel={'Disconnect'} provisionForm={true} />
                </Show>

                <Show when={provision.status !== PROVISION_STATUS.IDLE}>
                    <div class="loading-status" classList={{
                        'error': provision.status === PROVISION_STATUS.PROVISION_ERROR,
                        'success': provision.status === PROVISION_STATUS.PROVISION_SUCCESS,
                        'ongoing': provision.status === PROVISION_STATUS.PROVISIONING,
                    }}>
                        <p>{provision.message}</p>
                        <Show when={provision.status === PROVISION_STATUS.PROVISION_ERROR || provision.status === PROVISION_STATUS.PROVISION_SUCCESS}>
                            <button class="border border-primary" onClick={() => onWifiReset()}>Provision another?</button>
                        </Show> 
                    </div>
                </Show>

            </Show>



        </Show>

        <Show when={!wifi.power}>
            <h2>Wi-Fi is not Available. Please turn on the Wi-Fi.</h2>
        </Show>

    </div>
}

export default Provision;