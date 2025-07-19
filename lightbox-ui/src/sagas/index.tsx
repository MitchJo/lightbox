import {all} from 'redux-saga/effects';

import ConfigurationSaga from './configurations';
import MqttSaga from './mqtt';
import WiFiConnectionSaga from './wifiConnections';
import ProvisionSaga from './provisioning';
import LogsSaga from './logs';
import BleSaga from './ble';

export default function* rootSaga() {
  yield all([
    ConfigurationSaga(),
    MqttSaga(),
    WiFiConnectionSaga(),
    ProvisionSaga(),
    LogsSaga(),
    BleSaga()
  ]);
}
