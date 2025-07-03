import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import {  WIFI_CONNECT, WIFI_EVENTS, WIFI_SCAN } from "../constants";
import { wifiConnect, wifiEventsChannel, wifiScan } from "../utils/wifiConnections";

function* startListeningWifiEvents(channel: any): Generator<any, any, any> {
    while(true){
        const data = yield take (channel);
        console.log(data);
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

export default function* rootSaga() {
    yield all([
        fork(wifiConnectListener),
        fork(wifiScanListener),
        fork(wifiEventsListener)
    ]);
}