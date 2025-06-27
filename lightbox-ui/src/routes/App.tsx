import Header from "../components/Header";
import Modal from "../components/Modal";
import ConfigurationForm from "../components/ConfigurationForm";

import useRedux from '../store';
import sagaStore from '../store/saga';
import { mqttEvents, readConfig, saveConfig } from "../actions";
import { onMount } from "solid-js";

const App = (props: any) => {

    const [
        {configurations},
        {readConfiguration, saveConfigurations, mqttEventsListener}
    ] = useRedux(sagaStore,{
        readConfiguration: readConfig,
        saveConfigurations: saveConfig,
        mqttEventsListener: mqttEvents
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
        <Header title="Control your LightBox" onSettings={showConfiguration}/>
        <Modal ref={configModal}>
            <ConfigurationForm onClose={handleConfigFormClose} onFormSubmit={handleConfigFormSubmit} formValues={configurations}/>
        </Modal>
        {props.children}
    </>
};

export default App;