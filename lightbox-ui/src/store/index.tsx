import { onCleanup } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

function mapActions(store: any, actions: any) {
  const mapped: any = {};
  for (const key in actions) {
    mapped[key] = (...args: any) => store.dispatch(actions[key](...args));
  }
  return mapped;
}

export default function useRedux(store: any, actions: any) {
  const [state, setState] = createStore(store.getState());
  
  const unsubscribe = store.subscribe(() =>{

    const { configurations, mqtt, mqttLogs, wifi, wifiDevices, provision, logs, ble, bleDevices} = store.getState();

    setState('configurations',reconcile(configurations));
    
    setState('mqtt',reconcile(mqtt));

    setState('mqttLogs',reconcile(mqttLogs,{key:'log_id'}));

    setState('wifi',reconcile(wifi));

    setState('wifiDevices',reconcile(wifiDevices,{key: "ssid"}));

    setState('provision', reconcile(provision));

    setState('logs', reconcile(logs));

    setState('ble', reconcile(ble) );

    setState('bleDevices', reconcile(bleDevices, {key: "id"}))

  });

  onCleanup(() => unsubscribe());
  
  return [
    state,
    mapActions(store, actions)
  ];
};