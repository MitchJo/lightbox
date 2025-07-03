import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import {  WIFI_CONNECT, WIFI_EVENTS, WIFI_SCAN, WIFI_STATE } from "../constants";
import { getWifiState, wifiConnect, wifiEventsChannel, wifiScan } from "../utils/wifiConnections";

function* startListeningWifiEvents(channel: any): Generator<any, any, any> {
    while(true){
        const event = yield take (channel);
        switch(event.type){
            case 'wifi-connect':
                console.log('Wifi connect')
                return;
            case 'wifi-scan':
                console.log('Wifi Scan')
                return;
            default:
                return;
        }
    }
}

function* callWifiState(): Generator<any,any,any>{
    try{
       const wifiState = yield call(getWifiState);
       console.log(wifiState);
    }catch(e){
        console.log(e)
    }
}

function* callWifiConnect({payload}: any): Generator<any, any, any>{
    try{
       yield call(wifiConnect, payload)
    }catch(e){
        console.log(e)
    }
}

function* callWifiScan(): Generator<any, any, any>{
    try{
      yield call(wifiScan)
    }catch(e){
        console.log(e)
    }
}

function* callWifiEvents(): Generator<any,any,any>{
    const channel = yield call(wifiEventsChannel);
    if (channel) yield fork(startListeningWifiEvents, channel);
}


function* wifiConnectListener(){
    yield takeLatest(WIFI_CONNECT, callWifiConnect);
}

function* wifiScanListener(){
    yield takeLatest(WIFI_SCAN, callWifiScan);
}

function* wifiEventsListener(){
    yield takeLatest(WIFI_EVENTS, callWifiEvents);
}

function* getWifiStateListener(){
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