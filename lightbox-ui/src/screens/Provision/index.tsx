import { Component } from "solid-js";

import './style.css';
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { getWifiState, wifiScan } from "../../actions";

const Provision: Component = () => {

    const [
        { wifi },
        { onWifiScan, onGetWifiState }
    ] = useRedux(sagaStore, {
        onWifiScan: wifiScan,
        onGetWifiState: getWifiState
    });


    return <div class="provision-container">
        <h4>Provision</h4>
        <button class="primary" onClick={()=> onGetWifiState() }>Wifi State</button>
        <button class="border border-primary" onClick={()=> onWifiScan() }>Scan</button>
    </div>
}

export default Provision;