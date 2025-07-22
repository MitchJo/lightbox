import { Component, Show } from "solid-js"
import { BLE_CONNECTION_STATUS, MQTT_CONNECTION_STATUS } from "../../constants";

import './style.css'
import { A } from "@solidjs/router";

interface IHeader {
    onSettings: () => void;
    onLogs?: () => void;
    onShowBleForm: () => void;

    title: string;

    mqttStatus: MQTT_CONNECTION_STATUS;
    bleStatus: BLE_CONNECTION_STATUS;

    onMqttDisconnect: () => void;
    onMqttConnect: () => void;

    onBleDisconnect: () => void;
}

const Header: Component<IHeader> = (props: IHeader) => {
    return <header>
        <nav>
            <div class="nav-buttons">
                <A href="/" title="HOME"><span class="icon home" /></A>
                <h1>{props.title}</h1>
            </div>
            <div class="nav-buttons">

                <Show when={props.bleStatus === BLE_CONNECTION_STATUS.DISCONNECTED}>
                    <button classList={{
                        'success': props.mqttStatus === MQTT_CONNECTION_STATUS.DISCONNECTED,
                        'disabled': props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTED || props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTING
                    }} onClick={() => props.onShowBleForm()} disabled={props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTED || props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTING }>Connect BLE</button>
                </Show>

                <Show when={props.bleStatus === BLE_CONNECTION_STATUS.CONNECTED}>
                    <button class="danger" onClick={() => props.onBleDisconnect()} disabled={props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTED}>Disconnect</button>
                </Show>

                <Show when={props.mqttStatus === MQTT_CONNECTION_STATUS.DISCONNECTED}>
                    <button classList={{
                        'success': props.bleStatus === BLE_CONNECTION_STATUS.DISCONNECTED,
                        'disabled': props.bleStatus === BLE_CONNECTION_STATUS.CONNECTED || props.bleStatus === BLE_CONNECTION_STATUS.CONNECTING
                    }} onClick={() => props.onMqttConnect()} disabled={props.bleStatus === BLE_CONNECTION_STATUS.CONNECTED || props.bleStatus === BLE_CONNECTION_STATUS.CONNECTING }>Connect MQTT</button>
                </Show>

                <Show when={props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTED}>
                    <button class="danger" onClick={() => props.onMqttDisconnect()} disabled={props.bleStatus === BLE_CONNECTION_STATUS.CONNECTED}>Disconnect</button>
                </Show>

                <Show when={props.mqttStatus === MQTT_CONNECTION_STATUS.CONNECTING || props.bleStatus === BLE_CONNECTION_STATUS.CONNECTING}>
                    <button class="icon sm loading-icon" />
                </Show>

                <button onClick={props.onSettings} class="default">Settings</button>
                <button onClick={props?.onLogs} class="default">Logs</button>
                <A href="/provision" class="provision-btn">Provision</A>
            </div>
        </nav>
    </header>
}

export default Header;