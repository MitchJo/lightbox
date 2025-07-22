import { Component, For, Show } from "solid-js";
import { BLE_SCANNING_STATUS } from "../../constants";
import './style.css'

interface IBLEDeviceConnectionForm {
    onConnect: (id: string) => void;
    deviceLists: any[];
    onStartScan: () => void;
    onStopScan: () =>  void;
    scanStatus: BLE_SCANNING_STATUS;
    onClose: () => void;
}

const BLEDeviceConnectionForm: Component<IBLEDeviceConnectionForm> = (props: IBLEDeviceConnectionForm) => {
    return <div class="ble-container">
        <div class="action-buttons">
            <button class="primary" onClick={() => props.onStartScan() } disabled={props.scanStatus === BLE_SCANNING_STATUS.SCANNING} >Start Scan</button>
            <button class="border border-primary" onClick={() => props.onStopScan()}>Stop Scan</button>
            <button class="border border-primary" onClick={() => props.onClose()} disabled={ props.scanStatus === BLE_SCANNING_STATUS.SCANNING } >Close</button>
        </div>
        <Show when={props.deviceLists?.length}>
            <p>Click on the devices below to connect:</p>
        </Show>
        <div class="devices">
            <For each={props.deviceLists || []}>{(item, index) => (
                <button class="device" onClick={() => props.onConnect(item?.id || '')}>{item?.name || 'No name'}</button>
            )}</For>
        </div>
    </div>
}

export default BLEDeviceConnectionForm;