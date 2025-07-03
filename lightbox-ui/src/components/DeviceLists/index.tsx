import { Component, For } from "solid-js";

interface IDeviceList{
    devices: any[];
    onClick: (e: string) => void;
}

const DeviceList: Component<IDeviceList> = (props: IDeviceList) => {
    return <div class="device-lists">
        <For each={props.devices}>{(item, index)=>(
            <button onClick={() => props.onClick(item) }>{item.ssid}</button>
        )}</For>
    </div>
}

export default DeviceList;