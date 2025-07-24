import { Component, createSignal, Match, Switch } from "solid-js";

import './style.css';
import ColorWheel from "../../components/ColorWheel";
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { BLE_CONNECTION_STATUS, BLE_WRITABLE_CHARACTERISTIC, MQTT_CONNECTION_STATUS } from "../../constants";
import { bleWriteCharacteristic, mqttPublish } from "../../actions";
import BrightnessController from "../../components/BrightnessController";
import TransitionSelector from "../../components/TransitionSelector";
import BeeHiveColorChooser from "../../components/BeeHiveColorChooser";

const Home: Component = () => {

    const [bgColor, setBgColor] = createSignal('#f5f5f5')
    const [selectorType, setSelectorType] = createSignal('wheel');

    const [
        { mqtt, ble },
        { onMqttPublish, onBLEWrite }
    ] = useRedux(sagaStore, {
        onMqttPublish: mqttPublish,
        onBLEWrite: bleWriteCharacteristic
    });

    const handleBgColor = (e: any) => {
        setBgColor(e);
    }

    const handleColorSubmit = (e: any) => {
        if (mqtt.status !== MQTT_CONNECTION_STATUS.CONNECTED && ble.connection !== BLE_CONNECTION_STATUS.CONNECTED) return;

        if (mqtt.status === MQTT_CONNECTION_STATUS.CONNECTED) {
            onMqttPublish({ topic: 'lightbox/command', payload: { cmd: 234, data: { ...e } } });
            return;
        }

        if (ble.connection === BLE_CONNECTION_STATUS.CONNECTED) {
            const writeData = `{"cmd": 234,"data": {"red": ${e.red || 0},"green": ${e.green || 0},"blue": ${e.blue || 0}}}`
            const data = { ...BLE_WRITABLE_CHARACTERISTIC, writeData }
            onBLEWrite(data)
            return;
        }
    }

    const handleBrightness = (e: any) => {
        const { target: { value } } = e;
        if (mqtt.status !== MQTT_CONNECTION_STATUS.CONNECTED && ble.connection !== BLE_CONNECTION_STATUS.CONNECTED) return;

        if (mqtt.status === MQTT_CONNECTION_STATUS.CONNECTED) {
            onMqttPublish({ topic: 'lightbox/command', payload: { cmd: 236, data: { brightness: parseInt(value) } } });
            return;
        }

        if (ble.connection === BLE_CONNECTION_STATUS.CONNECTED) {
            const writeData = `{"cmd": 236,"data": {"brightness": ${parseInt(value)}}}`
            const data = { ...BLE_WRITABLE_CHARACTERISTIC, writeData }
            onBLEWrite(data)
            return;
        }
    }

    const handleTransition = (e: any) => {
        const { target: { value } } = e;
        if (mqtt.status !== MQTT_CONNECTION_STATUS.CONNECTED && ble.connection !== BLE_CONNECTION_STATUS.CONNECTED) return;

        if (mqtt.status === MQTT_CONNECTION_STATUS.CONNECTED) {
            onMqttPublish({ topic: 'lightbox/command', payload: { cmd: 237, data: { transitionType: parseInt(value) } } });
            return;
        }

        if (ble.connection === BLE_CONNECTION_STATUS.CONNECTED) {
            const writeData = `{"cmd": 237,"data": {"transitionType": ${parseInt(value)}}}`
            const data = { ...BLE_WRITABLE_CHARACTERISTIC, writeData }
            onBLEWrite(data)
            return;
        }
    }

    return <div class="home-page" style={{
        'background-color': bgColor()
    }}>
        <div class="color-selector">
            <div class="chooser-actions">
                <button classList={{
                    'primary': selectorType() === 'wheel',
                    'border': selectorType() !== 'wheel',
                    'border-primary': selectorType() !== 'wheel'
                }} onClick={() => setSelectorType('wheel')}> Wheel </button>
                <button classList={{
                    'primary': selectorType() === 'honeycomb',
                    'border': selectorType() !== 'honeycomb',
                    'border-primary': selectorType() !== 'honeycomb'
                }} onClick={() => setSelectorType('honeycomb')}> Honeycomb </button>
            </div>
            <Switch fallback={<span>Could not load a Colour Chooser.</span>}>
                <Match when={selectorType() === 'wheel'}>
                    <ColorWheel onColorChange={handleBgColor} onSendColor={handleColorSubmit} />
                </Match>
                <Match when={selectorType() === 'honeycomb'}>
                    <BeeHiveColorChooser onInput={handleColorSubmit} onColorSelect={handleBgColor} />
                </Match>
            </Switch>
        </div>
        <div class="component-group">
            <TransitionSelector onSelect={handleTransition} />
            <BrightnessController onChange={handleBrightness} activeTrackColor={bgColor()} value={50} />
        </div>
    </div>
}

export default Home;