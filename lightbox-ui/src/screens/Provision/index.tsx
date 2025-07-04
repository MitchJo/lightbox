import { Component, createSignal, onMount, Show } from "solid-js";

import './style.css';
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { getWifiState, wifiScan, wifiConnect, resetWifi } from "../../actions";
import DeviceList from "../../components/DeviceLists";
import ConfigurationForm from "../../components/ConfigurationForm";
import { WIFI_CONNECTION_STATUS, WIFI_SCANNING_STATUS } from "../../constants";

const Provision: Component = () => {

    const [
        { wifi, wifiDevices },
        { onWifiScan, onGetWifiState, onWifiConnect, onWifiReset }
    ] = useRedux(sagaStore, {
        onWifiScan: wifiScan,
        onGetWifiState: getWifiState,
        onWifiConnect: wifiConnect,
        onWifiReset: resetWifi
    });


    const onDeviceSelected = (e: any) => {
        // setConfigMode(true);
        onWifiConnect({ ssid: e.ssid });
    }

    const onConfig = () => {

    }

    onMount(() => {
        onGetWifiState();
    })


    return <div class="provision-container">

        <Show when={wifi.power}>

            <Show when={wifi.connection !== WIFI_CONNECTION_STATUS.CONNECTING && wifi.connection !== WIFI_CONNECTION_STATUS.CONNECTED}>
                <div class="row">
                    <button class="border border-primary" onClick={() => onWifiScan()} disabled={wifi.scan === WIFI_SCANNING_STATUS.SCANNING}>Scan</button>
                    <button class="primary" onClick={() => onWifiReset()}>Reset Wi-Fi</button>
                </div>
            </Show>


            <Show when={wifi.connection !== WIFI_CONNECTION_STATUS.CONNECTED}>
                <DeviceList devices={wifiDevices.devices} onClick={onDeviceSelected} connection={wifi.connection} ssid={wifi.ssid} />
            </Show>

            <Show when={wifi.connection === WIFI_CONNECTION_STATUS.CONNECTED}>
                <h3>Connected to: {wifi.ssid}</h3>
                <ConfigurationForm onFormSubmit={() => { }} onClose={() => onWifiReset()} formValues={{
                    protocol: 'mqtts',
                    host: '',
                    port: 8883,
                    privateKey: '',
                    rootCa: '',
                    deviceCert: ''
                }} closeLabel={'Disconnect'} />
            </Show>
            
        </Show>

        <Show when={!wifi.power}>
            <h2>Wi-Fi is not Available. Please turn on the Wi-Fi.</h2>
        </Show>

    </div>
}

export default Provision;