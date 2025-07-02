import { Component, createSignal } from "solid-js";

import './style.css';
import ColorWheel from "../../components/ColorWheel";
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { MQTT_CONNECTION_STATUS } from "../../constants";
import { mqttPublish } from "../../actions";
import BrightnessController from "../../components/BrightnessController";

const Home: Component = () => {

    const [bgColor, setBgColor] = createSignal('#f5f5f5')

    const [
        {mqtt},
        {onMqttPublish}
    ] = useRedux(sagaStore,{
        onMqttPublish: mqttPublish
    });

    const handleBgColor = (e: any) => {
        setBgColor(e);
    }

    const handleColorSubmit = (e: any) => {
        if(mqtt.status !== MQTT_CONNECTION_STATUS.CONNECTED) return;
        onMqttPublish({topic: 'lightbox/command', payload: {cmd: 234, data: {...e} } });
    } 

    const handleBrightness = (e: any) => {
        const {target: {value}} = e;
        if(mqtt.status !== MQTT_CONNECTION_STATUS.CONNECTED) return;
        onMqttPublish({topic: 'lightbox/command', payload: {cmd: 236, data: { brightness: parseInt(value) }} });
    }

    return <div class="home-page" style={{
        'background-color': bgColor()
    }}>
        <ColorWheel onColorChange={handleBgColor} onSendColor={handleColorSubmit}/>
        <BrightnessController onChange={handleBrightness} activeTrackColor={bgColor()} value={50}/>
    </div>
}

export default Home;