import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { WIFI_CONNECT, WIFI_SCANNING_STATUS, WIFI_EVENTS, WIFI_SCAN, WIFI_STATE } from "../constants";
import { getWifiState, wifiConnect, wifiEventsChannel, wifiScan } from "../utils/wifiConnections";
import { wifiActions } from "../reducers/wifiConnections";
import { WifiDevicesActions } from "../reducers/wifiDevices";

function* handleScanComplete(data: any) {
    console.log(data);
    const { setWifiScanning } = wifiActions;
    const { setDevices } = WifiDevicesActions;
    const { networks } = data || {};
    yield put(setWifiScanning({ scan: WIFI_SCANNING_STATUS.IDLE }))
    if (networks) yield put(setDevices(networks || []))
}

function* startListeningWifiEvents(channel: any): Generator<any, any, any> {

    while (true) {
        const event = yield take(channel);
        switch (event.type) {
            case 'wifi-connect':
                console.log('Wifi connect')
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