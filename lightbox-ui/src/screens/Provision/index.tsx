import { Component, onMount, Show } from "solid-js";

import './style.css';
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { getWifiState, wifiScan } from "../../actions";
import DeviceList from "../../components/DeviceLists";

const Provision: Component = () => {

    const [
        { wifi, wifiDevices },
        { onWifiScan, onGetWifiState }
    ] = useRedux(sagaStore, {
        onWifiScan: wifiScan,
        onGetWifiState: getWifiState
    });

    onMount(() => {
        onGetWifiState();
    })


    return <div class="provision-container">

        <Show when={wifi.power}>
            <div class="row">
                <button class="border border-primary" onClick={()=> onWifiScan() }>Scan</button>
            </div>

            <DeviceList devices={wifiDevices.devices} onClick={(e: any)=> console.log(e)}/>
        </Show>

        <Show when={!wifi.power}>
            <h2>Wi-Fi is not Available. Please turn on the Wi-Fi.</h2>
        </Show>

    </div>
}

export default Provision;