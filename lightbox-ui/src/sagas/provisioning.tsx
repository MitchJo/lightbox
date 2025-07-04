import { all, call, fork, put, take, takeLatest } from "redux-saga/effects";
import { INIT_PROVISION, PROVISION_STATUS } from "../constants";
import { initiateProvision } from "../utils/provisioning";
import { provisionActions } from "../reducers/provisioning";

function* callInitProvision({payload}: any): Generator<any, any, any>{
    if(!payload) return;
    const { setProvisionStatus  } = provisionActions;

    yield put( setProvisionStatus({status: PROVISION_STATUS.PROVISIONING, message: 'Provisioning, please wait...'}) )
    try{
        const response = yield call(initiateProvision, payload)
        console.log(response)
        yield put( setProvisionStatus({status: PROVISION_STATUS.PROVISION_SUCCESS, message: response }) )
    }catch(e){
        yield put( setProvisionStatus({status: PROVISION_STATUS.PROVISION_ERROR, message: e}) )
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