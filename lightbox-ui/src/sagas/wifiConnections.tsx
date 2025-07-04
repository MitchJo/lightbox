import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { WIFI_CONNECT, WIFI_SCANNING_STATUS, WIFI_EVENTS, WIFI_SCAN, WIFI_STATE, DEVICE_NAME, DEVICE_DEFAULT_PASSWORD, WIFI_RESET, WIFI_CONNECTION_STATUS } from "../constants";
import { getWifiState, wifiConnect, wifiEventsChannel, wifiReset, wifiScan } from "../utils/wifiConnections";
import { wifiActions } from "../reducers/wifiConnections";
import { WifiDevicesActions } from "../reducers/wifiDevices";

function* handleScanComplete({data}: any) {
    if(!data) return;

    const { setWifiScanning } = wifiActions;
    const { setDevices } = WifiDevicesActions;

    const devices = data?.filter((e: any) => e?.ssid.includes(DEVICE_NAME)) || []

    yield put(setWifiScanning({ scan: WIFI_SCANNING_STATUS.IDLE }))
    yield put(setDevices(devices))
}

function* handleWifiConnectEvent({data}: any) {
    if(!data) return;
    const {setWifiConnectionStatus} = wifiActions;
    const {success, ssid} = data;
    yield put(setWifiConnectionStatus({
        connection: success ? WIFI_CONNECTION_STATUS.CONNECTED : WIFI_CONNECTION_STATUS.DISCONNECTED,
        ssid: success ? ssid : ''
    }))
}


function* startListeningWifiEvents(channel: any): Generator<any, any, any> {

    while (true) {
        const event = yield take(channel);
        switch (event.type) {
            case 'wifi-connect':
                yield call(handleWifiConnectEvent, event)
                break;
            case 'wifi-scan':
                yield call(handleScanComplete, event);
                break;
            case 'wifi-reset':
                yield call(callWifiState);
                break;
            default:
                break;
        }
    }
}

function* callWifiState(): Generator<any, any, any> {
    const { setWifiStatus } = wifiActions;
    try {
        const wifiState = yield call(getWifiState);

        yield put(setWifiStatus({
            power: wifiState.power || false,
            ssid: wifiState.ssid || ""
        }))

    } catch (e) {
        console.log(e)
    }
}

function* callWifiConnect({ payload }: any): Generator<any, any, any> {
    const {setWifiConnectionStatus} = wifiActions;
    try {

        let newPayload = {...payload}
        const {ssid} = newPayload;

        yield put(setWifiConnectionStatus({
            connection: WIFI_CONNECTION_STATUS.CONNECTING,
            ssid
        }));

        if( ssid.includes(DEVICE_NAME) ) newPayload = {...newPayload, password: DEVICE_DEFAULT_PASSWORD, reconnect: false}
        yield call(wifiConnect, newPayload);

    } catch (e) {
        console.log(e)
    }
}

function* callWifiScan(): Generator<any, any, any> {
    const { setWifiScanning } = wifiActions;
    const { setDevices } = WifiDevicesActions;

    yield put(setWifiScanning({ scan: WIFI_SCANNING_STATUS.SCANNING }))
    yield put(setDevices([]))

    try {
        yield call(wifiScan)
    } catch (e) {
        console.log(e)
    }
}

function* callWifiEvents(): Generator<any, any, any> {
    const channel = yield call(wifiEventsChannel);
    if (channel) yield fork(startListeningWifiEvents, channel);
}

function* callResetWifi(): Generator<any,any,any>{
    const {resetWifiStatus} = wifiActions;
    try{
        yield put(resetWifiStatus({}))
        yield call(wifiReset);
    }catch(e){
        console.log(e);
    }
}

function* wifiConnectListener() {
    yield takeLatest(WIFI_CONNECT, callWifiConnect);
}


function* wifiScanListener() {
    yield takeLatest(WIFI_SCAN, callWifiScan);
}

function* wifiEventsListener() {
    yield takeLatest(WIFI_EVENTS, callWifiEvents);
}

function* getWifiStateListener() {
    yield takeLatest(WIFI_STATE, callWifiState)
}

function* resetWifiListener(){
    yield takeLatest(WIFI_RESET,callResetWifi)
}

export default function* rootSaga() {
    yield all([
        fork(wifiConnectListener),
        fork(wifiScanListener),
        fork(wifiEventsListener),
        fork(getWifiStateListener),
        fork(resetWifiListener)
    ]);
}