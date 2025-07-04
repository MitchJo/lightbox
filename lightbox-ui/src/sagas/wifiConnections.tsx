import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { WIFI_CONNECT, WIFI_SCANNING_STATUS, WIFI_EVENTS, WIFI_SCAN, WIFI_STATE, DEVICE_NAME, DEVICE_DEFAULT_PASSWORD } from "../constants";
import { getWifiState, wifiConnect, wifiEventsChannel, wifiScan } from "../utils/wifiConnections";
import { wifiActions } from "../reducers/wifiConnections";
import { WifiDevicesActions } from "../reducers/wifiDevices";

function* handleScanComplete(data: any) {
    const { setWifiScanning } = wifiActions;
    const { setDevices } = WifiDevicesActions;

    const devices = data?.filter((e: any) => e?.ssid.includes(DEVICE_NAME)) || []

    yield put(setWifiScanning({ scan: WIFI_SCANNING_STATUS.IDLE }))
    yield put(setDevices(devices))
}

function* startListeningWifiEvents(channel: any): Generator<any, any, any> {

    while (true) {
        const event = yield take(channel);
        switch (event.type) {
            case 'wifi-connect':
                console.log('Wifi connect',event)
                break;
            case 'wifi-scan':
                yield call(handleScanComplete, event.data || {});
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
            connection: wifiState.connection,
            power: wifiState.power || false,
            ssid: wifiState.ssid || ""
        }))

    } catch (e) {
        console.log(e)
    }
}

function* callWifiConnect({ payload }: any): Generator<any, any, any> {
    try {
        let newPayload = {...payload}
        const {ssid} = newPayload;
        if( ssid.includes(DEVICE_NAME) ) newPayload = {...newPayload, password: DEVICE_DEFAULT_PASSWORD, reconnect: false}
        yield call(wifiConnect, payload)
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

export default function* rootSaga() {
    yield all([
        fork(wifiConnectListener),
        fork(wifiScanListener),
        fork(wifiEventsListener),
        fork(getWifiStateListener)
    ]);
}