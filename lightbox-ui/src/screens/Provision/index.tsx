import { Component } from "solid-js";

import './style.css';
import { A } from "@solidjs/router";
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { wifiScan } from "../../actions";

const Provision: Component = () => {

    const [
        { wifi },
        { onWifiScan }
    ] = useRedux(sagaStore, {
        onWifiScan: wifiScan
    });


    return <div class="provision-container">
        <A href="/" end={true}>Home</A>
        <h4>Provision</h4>

        <button onClick={()=> onWifiScan() }>Scan</button>
    </div>
}

export default Provision;