import { Component, For, Show } from "solid-js";

import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { bleConnect, bleDisconnect, bleStartScan, bleStopScan, bleSubscribeToCharacteristic, bleUnsubscribeFromCharacteristic, bleWriteCharacteristic } from "../../actions";
import { BLE_CONNECTION_STATUS, BLE_SCANNING_STATUS } from "../../constants";
import BLECharacteristics from "../../components/BLECharacteristics";

const BLEScreen: Component = () => {

    const [
        { ble, bleDevices },
        { onBLEStartScan, onBLEStopScan, onBLEDisconnect, onBLEConnect, onBLESubscribe, onBLEUnsubscribe, onBLEWrite }
    ] = useRedux(sagaStore, {
        onBLEStartScan: bleStartScan,
        onBLEStopScan: bleStopScan,
        onBLEConnect: bleConnect,
        onBLEDisconnect: bleDisconnect,
        onBLESubscribe: bleSubscribeToCharacteristic,
        onBLEUnsubscribe: bleUnsubscribeFromCharacteristic,
        onBLEWrite: bleWriteCharacteristic
    });

    const handleConnect = (id: string) => {
        if (!id.length) return;
        console.log('Connecting to...', id)
        onBLEConnect(id);
    }

    const handleCharacteristicsSubscribe = (data: any) => {
        console.log('SUB',data);
        onBLESubscribe(data);
    }

    const handleCharacteristicsUnSubscribe = (data: any) => {
        console.log("UNSUB", data);
        onBLEUnsubscribe(data);
    }

    const handleWriteCharacteristics = (data: any) => {
        console.log('Wrintinf');
        const writeData = '{"cmd": 234,"data": {"red": 0,"green": 255,"blue": 0}}'
        onBLEWrite({...data, writeData});
    }

    return <div class="container">

        <Show when={ble.connection === BLE_CONNECTION_STATUS.DISCONNECTED}>
            <div class="action-buttons">
                <button class="primary" onClick={() => onBLEStartScan()} disabled={ble.scan === BLE_SCANNING_STATUS.SCANNING} >Start Scan</button>
                <button class="border border-primary" onClick={() => onBLEStopScan()}>Stop Scan</button>
            </div>
        </Show>

        <Show when={ble.connection === BLE_CONNECTION_STATUS.CONNECTED}>
            <div class="action-buttons">
                <button class="primary" onClick={() => onBLEDisconnect()}>Disconnect</button>
            </div>
        </Show>

        <Show when={ble.connection === BLE_CONNECTION_STATUS.CONNECTING}>
            <p>Establishing Connecting...</p>
        </Show>

        <div class="devices">
            <For each={bleDevices?.devices || []}>{(item, index) => (
                <button onClick={() => handleConnect(item?.id || '')}>{item?.name || 'No name'}</button>
            )}</For>
        </div>

        <Show when={ble.connection === BLE_CONNECTION_STATUS.CONNECTED && ble.serviceCharacteristics}>
            <div class="action-buttons">
                <For each={ble.serviceCharacteristics}>{(item, index) => (
                    <BLECharacteristics characteristics={item.characteristics} 
                    onSubscribe={handleCharacteristicsSubscribe} 
                    onUnsubscribe={handleCharacteristicsUnSubscribe} serviceUUID={item.uuid}
                    onWrite = {handleWriteCharacteristics}
                    />
                )}</For>
            </div>
        </Show>

    </div>
}

export default BLEScreen;