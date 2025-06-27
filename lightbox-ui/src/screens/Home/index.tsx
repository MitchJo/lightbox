import { Component, createSignal } from "solid-js";

import './style.css';
import ColorWheel from "../../components/ColorWheel";
import useRedux from '../../store';
import sagaStore from '../../store/saga';
import { MQTT_CONNECTION_STATUS } from "../../constants";

const Home: Component = () => {

    const [bgColor, setBgColor] = createSignal('#f5f5f5')

    const [
        {mqtt},
        {}
    ] = useRedux(sagaStore,{
    });

    const handleBgColor = (e: any) => {
        setBgColor(e);
    }

    const handleColorSubmit = (e: any) => {
        if(mqtt.status !== MQTT_CONNECTION_STATUS.CONNECTED) return;
        console.log('Publish', e)
    } 

    return <div class="home-page" style={{
        'background-color': bgColor()
    }}>
        <ColorWheel onColorChange={handleBgColor} onSendColor={handleColorSubmit}/>
    </div>
}

export default Home;