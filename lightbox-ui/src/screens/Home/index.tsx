import { Component, createSignal } from "solid-js";

import './style.css';
import ColorWheel from "../../components/ColorWheel";
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { MQTT_CONNECTION_STATUS } from "../../constants";
import { mqttPublish } from "../../actions";

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
        onMqttPublish({topic: 'lightbox/command', payload: {readCmd: 234, ...e} });
    } 

    return <div class="home-page" style={{
        'background-color': bgColor()
    }}>
        <ColorWheel onColorChange={handleBgColor} onSendColor={handleColorSubmit}/>
    </div>
}

export default Home;