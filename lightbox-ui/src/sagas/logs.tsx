import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { READ_LOGS } from "../constants";
import { readLogs } from "../utils/logs";
import { logsActions } from "../reducers/logs";

function* callReadLogs(): Generator<any, any, any>{

    const {setLogs, resetLogs} = logsActions;
    yield put(resetLogs({}))
    try{
        const response = yield call(readLogs);
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(response);
        yield put(setLogs({value: text}));
    }catch(e){
        console.log(e)
    }
}

function* readLogsListener(){
    yield takeLatest(READ_LOGS, callReadLogs)
}

export default function* rootSaga() {
    yield all([
        fork(readLogsListener)
    ]);
}