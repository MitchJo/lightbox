import { Component, Match, Switch } from "solid-js";

import './style.css';

import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { mqttConnect, mqttDisconnect } from "../../actions";
import { MQTT_CONNECTION_STATUS } from "../../constants";

const Home: Component = () => {

    const [
        { mqtt },
        { mqttConnectC, mqttDisconnectC }
    ] = useRedux(sagaStore, {
        mqttConnectC: mqttConnect,
        mqttDisconnectC: mqttDisconnect
    });

    return <div>
        <h1>Home</h1>
        <div class="connection-container">
            <Switch fallback={<span>Connecting...</span>}>
                <Match when={mqtt.status === MQTT_CONNECTION_STATUS.DISCONNECTED}>
                    <button class="primary" onClick={()=> mqttConnectC() }>Connect</button>
                </Match>
                <Match when={mqtt.status === MQTT_CONNECTION_STATUS.CONNECTED}>
                    <button class="border border-primary"  onClick={()=> mqttDisconnectC() }>Disconnect</button>
                </Match>
                <Match when={mqtt.status === MQTT_CONNECTION_STATUS.CONNECTING}>
                    <span>Connecting...</span>
                </Match>
            </Switch>
        </div>
    </div>
}

export default Home;