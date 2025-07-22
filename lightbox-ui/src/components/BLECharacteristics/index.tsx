import { Component, For } from "solid-js"

interface IBLECharacteristics {
    characteristics: any[];
    serviceUUID: string;
    onSubscribe: (data: {service: string, characteristic: string}) => void;
    onUnsubscribe: (data: {service: string, characteristic: string}) => void;
    onWrite: (data: {service: string, characteristic: string}) => void;
}

const BLECharacteristics: Component<IBLECharacteristics> = (props: IBLECharacteristics) => {
    return <div>
        <For each={props.characteristics || []}>{(item, index) => (
            <div>
                <label>{props.serviceUUID || 'NO UUID'}</label>
                <button onClick={() => props.onSubscribe({service: props.serviceUUID, characteristic: item?.uuid})}>Subscribe</button>
                <button onClick={() => props.onUnsubscribe({service: props.serviceUUID, characteristic: item?.uuid})}>UnSubscribe</button>
                <button onClick={() => props.onWrite({service: props.serviceUUID, characteristic: item?.uuid})}>Write</button>
            </div>
        )}</For>
    </div>
}

export default BLECharacteristics;