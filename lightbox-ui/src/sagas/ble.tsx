import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { BLE_CONNECT, BLE_CONNECTION_STATUS, BLE_DISCONNECT, BLE_EVENTS, BLE_SCANNING_STATUS, BLE_START_SCAN, BLE_STOP_SCAN, BLE_SUBSCRIBE, BLE_SUBSCRIPTION_STATUS, BLE_UNSUBSCRIBE, BLE_WRITE } from "../constants";
import { bleConnect, bleDisconnect, bleEventsChannel, bleStartScan, bleStopScan, bleSubscribe, bleUnsubscribe, bleWrite } from "../utils/ble";
import { bleActions } from "../reducers/bleConnection";
import { bleDevicesActions } from "../reducers/bleDevices";

function* handleOnScanEvent(devices: any): Generator<any, any, any> {
    const { setDevices } = bleDevicesActions;
    yield put(setDevices(devices));
}

function* handleOnBleConnection(data: any): Generator<any, any, any> {
    const { setBleConnectionStatus } = bleActions;

    const { connected, id } = data || {};

    yield put(setBleConnectionStatus({ connection: connected ? BLE_CONNECTION_STATUS.CONNECTED : BLE_CONNECTION_STATUS.DISCONNECTED, deviceId: connected ? id : '', serviceCharacteristics: undefined }))
}

function* handleBLEServicesCharacteristics(data: any) {
    const { setServiceCharacteristics } = bleActions;
    yield put(setServiceCharacteristics({ serviceCharacteristics: data }))
}


function* startListeningBleEvents(channel: any): Generator<any, any, any> {
    while (true) {
        const { type, data } = yield take(channel);
        switch (type) {
            case 'scan':
                yield call(handleOnScanEvent, data);
                break;

            case 'connection':
                yield call(handleOnBleConnection, data);
                break;

            case 'bleServiceCharacteristics':
                yield call(handleBLEServicesCharacteristics, data);
                break;

            case 'ble-notification':
                console.log(data);
                break;

            default:
                break;
        }
    }

}

function* callDeviceConnect({ id }: any): Generator<any, any, any> {
    const { resetDevices } = bleDevicesActions;
    const { setBleConnectionStatus } = bleActions;

    yield put(resetDevices({}))
    yield put(setBleConnectionStatus({ connection: BLE_CONNECTION_STATUS.CONNECTING }))

    try {
        const response = yield call(bleConnect, id);
        console.log(response);
    } catch (e) {
        console.log(e);
        yield put(setBleConnectionStatus({ connection: BLE_CONNECTION_STATUS.DISCONNECTED }))
    }
}

function* callDeviceDisconnect(): Generator<any, any, any> {
    try {
        const response = yield call(bleDisconnect);
        console.log(response);
    } catch (e) {
        console.log(e)
    }
}

function* callSubscribe({ data }: any): Generator<any, any, any> {
    const { setSubscriptionStatus } = bleActions;

    yield put(setSubscriptionStatus({ subscriptionStatus: BLE_SUBSCRIPTION_STATUS.SUBSCRIBING }))

    try {
        const response = yield call(bleSubscribe, data);
        yield put(setSubscriptionStatus({ subscriptionStatus: response === 'OK' ? BLE_SUBSCRIPTION_STATUS.SUBSCRIBED : BLE_SUBSCRIPTION_STATUS.NOT_SUBSCRIBED }))
    } catch (e) {
        yield put(setSubscriptionStatus({ subscriptionStatus: BLE_SUBSCRIPTION_STATUS.NOT_SUBSCRIBED }))
        console.log(e)
    }

}


function* callUnsubscribe({ data }: any): Generator<any, any, any> {
    const { setSubscriptionStatus } = bleActions;
    
    try {
        yield put(setSubscriptionStatus({ subscriptionStatus: BLE_SUBSCRIPTION_STATUS.NOT_SUBSCRIBED }))
        const response = yield call(bleUnsubscribe, data);
        console.log(response);
    } catch (e) {
        console.log(e)
    }

}

function* callBleWrite({ data }: any): Generator<any, any, any> {
    
    try {
        const response = yield call(bleWrite, data);
        console.log(response);
    } catch (e) {
        console.log(e)
    }

}


function* callStartScan(): Generator<any, any, any> {
    const { resetBleStatus, setBleScanning } = bleActions;
    const { resetDevices } = bleDevicesActions;

    yield put(resetBleStatus({}));
    yield put(resetDevices({}));

    try {
        yield put(setBleScanning({ scan: BLE_SCANNING_STATUS.SCANNING }))
        const response = yield call(bleStartScan);
        console.log(response);
    } catch (e) {
        yield put(setBleScanning({ scan: BLE_SCANNING_STATUS.IDLE }))
        console.log(e)
    }

}

function* callStopScan(): Generator<any, any, any> {
    const { setBleScanning } = bleActions;

    try {
        yield put(setBleScanning({ scan: BLE_SCANNING_STATUS.IDLE }))
        const response = yield call(bleStopScan);
        console.log(response);
    } catch (e) {
        console.log(e)
    }

}

function* callBleEvents(): Generator<any, any, any> {
    const channel = yield call(bleEventsChannel);
    if (channel) yield fork(startListeningBleEvents, channel);
}

function* bleStartScanListener() {
    yield takeLatest(BLE_START_SCAN, callStartScan)
}

function* bleStopScanListener() {
    yield takeLatest(BLE_STOP_SCAN, callStopScan)
}

function* bleConnectListener() {
    yield takeLatest(BLE_CONNECT, callDeviceConnect)
}

function* bleDisconnectListener() {
    yield takeLatest(BLE_DISCONNECT, callDeviceDisconnect)
}

function* bleSubscribeListener() {
    yield takeLatest(BLE_SUBSCRIBE, callSubscribe)
}

function* bleUnsubscribeListener() {
    yield takeLatest(BLE_UNSUBSCRIBE, callUnsubscribe)
}

function* bleWriteListener(){
    yield takeLatest(BLE_WRITE, callBleWrite)
}

function* bleEventsListener() {
    yield takeLatest(BLE_EVENTS, callBleEvents);
}

export default function* rootSaga() {
    yield all([
        fork(bleEventsListener),
        fork(bleStartScanListener),
        fork(bleStopScanListener),
        fork(bleConnectListener),
        fork(bleDisconnectListener),
        fork(bleSubscribeListener),
        fork(bleUnsubscribeListener),
        fork(bleWriteListener)
    ]);
}