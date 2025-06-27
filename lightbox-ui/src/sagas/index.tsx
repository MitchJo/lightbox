import {all} from 'redux-saga/effects';

import ConfigurationSaga from './configurations';
import MqttSaga from './mqtt';

export default function* rootSaga() {
  yield all([
    ConfigurationSaga(),
    MqttSaga()
  ]);
}
