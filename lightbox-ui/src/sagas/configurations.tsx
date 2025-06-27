import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { READ_CONFIG, SAVE_CONFIG } from "../constants";
import { configActions } from "../reducers/configurations";
import { readConfigurations, saveConfigurations } from "../utils/configurations";

function* callReadConfig(): Generator<any, any, any>{
    try{
        const config = yield call(readConfigurations)
        yield put( configActions.setConfig({...config}) )
    }catch(e){
        console.log(e)
    }
}

function* callSaveConfig({payload}: any): Generator<any, any, any>{
    try{
        const config = yield call(saveConfigurations, payload)
        const configJson = JSON.parse(config)
        yield put( configActions.setConfig({...configJson}) )
    }catch(e){
        console.log(e)
    }
}

function* readConfigListener(){
    yield takeLatest(READ_CONFIG, callReadConfig)
}

function* saveConfigListener(){
    yield takeLatest(SAVE_CONFIG, callSaveConfig)
}

export default function* rootSaga() {
    yield all([
        fork(readConfigListener),
        fork(saveConfigListener)
    ]);
}