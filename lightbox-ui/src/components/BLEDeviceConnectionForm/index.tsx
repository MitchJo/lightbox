import { Component, For, Show } from "solid-js";
import { BLE_ADAPTER_STATE, BLE_SCANNING_STATUS } from "../../constants";
import './style.css'

interface IBLEDeviceConnectionForm {
    onConnect: (id: string) => void;
    deviceLists: any[];
    onStartScan: () => void;
    onStopScan: () =>  void;
    scanStatus: BLE_SCANNING_STATUS;
    onClose: () => void;
    adapterState: BLE_ADAPTER_STATE
}

const BLEDeviceConnectionForm: Component<IBLEDeviceConnectionForm> = (props: IBLEDeviceConnectionForm) => {
    return <div class="ble-container">
        <div class="action-buttons">
            <button class="primary" onClick={() => props.onStartScan() } disabled={props.scanStatus === BLE_SCANNING_STATUS.SCANNING || props.adapterState !== BLE_ADAPTER_STATE.ON } >Start Scan</button>
            <button class="border border-primary" onClick={() => props.onStopScan()}>Stop Scan</button>
            <button class="border border-primary" onClick={() => props.onClose()} disabled={ props.scanStatus === BLE_SCANNING_STATUS.SCANNING } >Close</button>
        </div>
        <Show when={props.deviceLists?.length}>
            <p>Click on the devices below to connect:</p>
        </Show>
        <Show when={props.adapterState !== BLE_ADAPTER_STATE.ON}>
            <p>The Bluetooth adapter is in an invalid state. Please turn it on.</p>
        </Show>
        <div class="devices">
            <For each={props.deviceLists || []}>{(item, index) => (
                <button class="device" onClick={() => props.onConnect(item?.id || '')}>{item?.name || 'No name'}</button>
            )}</For>
        </div>
    </div>
}

export default BLEDeviceConnectionForm;