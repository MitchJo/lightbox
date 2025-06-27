import Header from "../components/Header";
import Modal from "../components/Modal";
import ConfigurationForm from "../components/ConfigurationForm";

import useRedux from '../store';
import sagaStore from '../store/saga';
import { mqttConnect, mqttDisconnect, mqttEvents, readConfig, saveConfig } from "../actions";
import { onMount } from "solid-js";

const App = (props: any) => {

    const [
        {configurations, mqtt},
        {readConfiguration, saveConfigurations, mqttEventsListener, mqttConnectC, mqttDisconnectC}
    ] = useRedux(sagaStore,{
        readConfiguration: readConfig,
        saveConfigurations: saveConfig,
        mqttEventsListener: mqttEvents,
        mqttConnectC: mqttConnect,
        mqttDisconnectC: mqttDisconnect
    });

    let configModal: any;

    const handleConfigFormClose = () => {
        setTimeout(() => {
            configModal?.close('cancelled')
        }, 10);
    }

    const handleConfigFormSubmit = (e: any) => {
        saveConfigurations(e);
        configModal?.close('cancelled')
    }

    const showConfiguration = () => {
        if(!configModal) return;
        const isOpen = configModal?.getAttribute('open');
        if(isOpen) {
            handleConfigFormClose();
        }else{
            configModal?.showModal();
        }
    }

    onMount(() => {
        readConfiguration();
        mqttEventsListener();
    })


    return <>
        <Header title="Control your LightBox" onSettings={showConfiguration} mqttStatus={mqtt.status} onMqttConnect={mqttConnectC} onMqttDisconnect={mqttDisconnectC}/>
        <Modal ref={configModal}>
            <ConfigurationForm onClose={handleConfigFormClose} onFormSubmit={handleConfigFormSubmit} formValues={configurations}/>
        </Modal>
        {props.children}
    </>
};

export default App;