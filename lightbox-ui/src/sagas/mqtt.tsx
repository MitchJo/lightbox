import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { MQTT_CONNECT, MQTT_CONNECTION_STATUS, MQTT_DISCONNECT, MQTT_EVENTS, MQTT_PUBLISH } from "../constants";
import { mqttConnect, mqttDisconnect, mqttEventsChannel, mqttPublish } from "../utils/mqtt";
import { mqttActions } from "../reducers/mqtt";

function* startListeningMqttEvents(channel: any): Generator<any, any, any> {
    const {setMqttStatus} = mqttActions;
    while(true){
        const {type, data} = yield take (channel);
        // console.log(type, data);

        switch (type) {
            case 'connection':
                const {connected} = data;
                yield put( setMqttStatus(connected ? MQTT_CONNECTION_STATUS.CONNECTED : MQTT_CONNECTION_STATUS.DISCONNECTED) )
                break;

            case 'subscription':
                // handleSubscription(data);
                break;

            case 'publish':
                // handlePublish(data);
                break;

            case 'message':
                // handleMessage(data);
                break;
        
            default:
                break;
        }
    }

}

function* callMqttConnect(): Generator<any, any, any>{
    const {setMqttStatus} = mqttActions;
    yield put( setMqttStatus(MQTT_CONNECTION_STATUS.CONNECTING) )
    try{
       yield call(mqttConnect)
    }catch(e){
        console.log(e)
    }
}

function* callMqttDisconnect(): Generator<any, any, any>{
    try{
      yield call(mqttDisconnect)
    }catch(e){
        console.log(e)
    }
}

function* callMqttPublish({payload}: any): Generator<any,any,any>{
    if(!payload) return;
    try{
        yield call(mqttPublish, payload)
    }catch(e){
        console.log(e)
    }
}

function* callMqttEvents(): Generator<any,any,any>{
    const channel = yield call(mqttEventsChannel);
    if (channel) yield fork(startListeningMqttEvents, channel);
}


function* mqttConnectListener(){
    yield takeLatest(MQTT_CONNECT, callMqttConnect);
}

function* mqttDisconnectListener(){
    yield takeLatest(MQTT_DISCONNECT, callMqttDisconnect);
}

function* mqttPublishListener(){
    yield takeLatest(MQTT_PUBLISH, callMqttPublish);
}

function* mqttEventsListener(){
    yield takeLatest(MQTT_EVENTS, callMqttEvents);
}

export default function* rootSaga() {
    yield all([
        fork(mqttConnectListener),
        fork(mqttDisconnectListener),
        fork(mqttPublishListener),
        fork(mqttEventsListener)
    ]);
}