import Header from "../components/Header";
import Modal from "../components/Modal";
import ConfigurationForm from "../components/ConfigurationForm";

import useRedux from '../store';
import sagaStore from '../store/saga';
import { mqttConnect, mqttDisconnect, mqttEvents, readConfig, readLogs, saveConfig, wifiEvents } from "../actions";
import { onMount } from "solid-js";
import LogsContainer from "../components/LogsContainer";
import { bleConnect, bleDisconnect, bleStartScan, bleStopScan, listenToBleEvents } from "../actions/ble";
import BLEDeviceConnectionForm from "../components/BLEDeviceConnectionForm";

const App = (props: any) => {

    const [
        { configurations, mqtt, logs, ble, bleDevices },
        { 
            readConfiguration, saveConfigurations, 
            mqttEventsListener, mqttConnectC, mqttDisconnectC, 
            wifiEventListener, 
            onReadLogs, 
            onListenToBleEvents, onBLEStartScan,onBLEStopScan, onBLEConnect, onBLEDisconnect
        }
    ] = useRedux(sagaStore, {
        readConfiguration: readConfig,
        saveConfigurations: saveConfig,
        mqttEventsListener: mqttEvents,
        mqttConnectC: mqttConnect,
        mqttDisconnectC: mqttDisconnect,
        wifiEventListener: wifiEvents,
        onReadLogs: readLogs,
        onListenToBleEvents: listenToBleEvents,
        onBLEStartScan: bleStartScan,
        onBLEStopScan: bleStopScan,
        onBLEConnect: bleConnect,
        onBLEDisconnect: bleDisconnect,
    });

    let configModal: any;
    let logModal: any;
    let bleModal: any;

    const handleConfigFormClose = () => {
        setTimeout(() => {
            configModal?.close('cancelled')
        }, 10);
    }

    const handleConfigFormSubmit = (e: any) => {
        saveConfigurations(e);
        configModal?.close('cancelled')
    }

    const handleBleFormClose = () => {
        setTimeout(() => {
            bleModal?.close('cancelled')
        }, 10);
    }

    const showConfiguration = () => {
        if (!configModal) return;
        const isOpen = configModal?.getAttribute('open');
        if (isOpen) {
            handleConfigFormClose();
        } else {
            configModal?.showModal();
        }
    }

    const onLogs = () => {
        if (!logModal) return;
        const isOpen = logModal?.getAttribute('open');
        
        if (isOpen) {
            handleConfigFormClose();
        } else {
            logModal?.showModal();
            onReadLogs();
        }

    }

    const showBleForm = () => {
        if (!bleModal) return;
        const isOpen = bleModal?.getAttribute('open');
        if (isOpen) {
            handleBleFormClose();
        } else {
            bleModal?.showModal();
        }
    }

    const handleBleConnect = (id: string) => {
        handleBleFormClose();
        onBLEConnect(id);
    }

    onMount(() => {
        readConfiguration();
        mqttEventsListener();
        wifiEventListener();
        onListenToBleEvents();
    })

    return <>
        <Header 
            title="Control your LightBox" 
            onSettings={showConfiguration} 
            onLogs={onLogs} 
            mqttStatus={mqtt.status} 

            onMqttConnect={mqttConnectC} 
            onMqttDisconnect={mqttDisconnectC}

            bleStatus={ble.connection}
            onShowBleForm={showBleForm}
            onBleDisconnect={()=> onBLEDisconnect() }
            />
        <Modal ref={configModal}>
            <ConfigurationForm onClose={handleConfigFormClose} onFormSubmit={handleConfigFormSubmit} formValues={configurations} />
        </Modal>

        <Modal ref={logModal}>
            <LogsContainer logs={logs?.value || ''} onClose={() => logModal?.close('cancelled')} onRefresh={() => onReadLogs() }/>
        </Modal>

        <Modal ref={bleModal}>
            <BLEDeviceConnectionForm deviceLists={bleDevices?.devices} 
            onConnect={handleBleConnect} 
            onStartScan={onBLEStartScan} 
            onStopScan={onBLEStopScan} 
            scanStatus={ble.scan}
            onClose={handleBleFormClose}
            />
        </Modal>

        {props.children}
    </>
};

export default App;