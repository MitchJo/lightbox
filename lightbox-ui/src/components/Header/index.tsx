import { Component, Match, Switch } from "solid-js"
import { MQTT_CONNECTION_STATUS } from "../../constants";

import './style.css'
import { A } from "@solidjs/router";

interface IHeader {
    onSettings: () => void;
    onLogs?: () => void;
    title: string;
    mqttStatus: MQTT_CONNECTION_STATUS;
    onMqttDisconnect: () => void;
    onMqttConnect: () => void;
}

const Header: Component<IHeader> = (props: IHeader) => {
    return <header>
        <nav>
            <div class="nav-buttons">
                <A href="/" title="HOME"><span class="icon home"/></A>
                <h1>{props.title}</h1>
            </div>
            <div class="nav-buttons">
                <Switch fallback={<button class="icon sm loading-icon" />}>
                    <Match when={props.mqttStatus === MQTT_CONNECTION_STATUS.DISCONNECTED}>
                        <button class="success" onClick={() => props.onMqttConnect()}>Connect</button>
                    </Match>
                    <Match when={props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTED}>
                        <button class="danger" onClick={() => props.onMqttDisconnect()}>Disconnect</button>
                    </Match>
                    <Match when={props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTING}>
                        <button class="icon sm loading-icon" />
                    </Match>
                </Switch>
                <button onClick={props.onSettings} class="default">Settings</button>
                <button onClick={props?.onLogs} class="default">Logs</button>
                <A href="/provision" class="provision-btn">Provision</A>
            </div>
        </nav>
    </header>
}

export default Header;