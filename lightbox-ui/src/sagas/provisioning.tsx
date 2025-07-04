import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { INIT_PROVISION, PROVISION_PATH, PROVISION_STATUS } from "../constants";
import { initiateProvision } from "../utils/provisioning";
import { provisionActions } from "../reducers/provisioning";

function* callInitProvision({payload}: any): Generator<any, any, any>{
    if(!payload) return;
    const { setProvisionStatus  } = provisionActions;

    yield put( setProvisionStatus(PROVISION_STATUS.PROVISIONING) )
    try{
        const response = yield call(initiateProvision, payload, PROVISION_PATH)
        // yield put( configActions.setConfig({...config}) )
        yield put( setProvisionStatus(PROVISION_STATUS.PROVISION_SUCCESS) )
    }catch(e){
        console.log(e)
        yield put( setProvisionStatus(PROVISION_STATUS.PROVISION_ERROR) )
    }
}

function* initProvisionListener(){
    yield takeLatest(INIT_PROVISION, callInitProvision)
}

export default function* rootSaga() {
    yield all([
        fork(initProvisionListener)
    ]);
}