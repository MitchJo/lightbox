import { Component, For } from "solid-js";
import './style.css';
import { WIFI_CONNECTION_STATUS } from "../../constants";

interface IDeviceList {
    devices: any[];
    onClick: (e: string) => void;
    ssid: string;
    connection: WIFI_CONNECTION_STATUS
}

const DeviceList: Component<IDeviceList> = (props: IDeviceList) => {
    return <div class="device-lists">
        <For each={props.devices}>{(item, index) => (
            <button class="device-item" onClick={() => props.onClick(item)}
                disabled={props.ssid !== item.ssid && props.connection === WIFI_CONNECTION_STATUS.CONNECTING}
            >{props.ssid == item.ssid && props.connection === WIFI_CONNECTION_STATUS.CONNECTING ? 'Connecting...' : item.ssid}</button>
        )}</For>
    </div>
}

export default DeviceList;