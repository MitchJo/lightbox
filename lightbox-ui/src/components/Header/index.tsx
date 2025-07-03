import { Component, Match, Switch } from "solid-js"
import { MQTT_CONNECTION_STATUS } from "../../constants";

import './style.css'
import { A } from "@solidjs/router";

interface IHeader {
    onSettings: () => void;
    title: string;
    mqttStatus: MQTT_CONNECTION_STATUS;
    onMqttDisconnect: () => void;
    onMqttConnect: () => void;
}

const Header: Component<IHeader> = (props: IHeader) => {
    return <header>
        <nav>
            <h1>{props.title}</h1>
            <div class="left-buttons">
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
                <A href="/provision">Provision</A>
            </div>
        </nav>
    </header>
}

export default Header;