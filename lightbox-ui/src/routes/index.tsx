import { Router, Route, HashRouter } from "@solidjs/router";
import Home from "../screens/Home";
import NotFound from "../screens/NotFound";
import App from "./App";
import Provision from "../screens/Provision";
import BLEScreen from "../screens/BLEScreen";

const Routing = () => (
    <HashRouter root={App}>
        <Route path="/" component={Home} />
        <Route path="/provision" component={Provision} />
        <Route path="/ble" component={BLEScreen} />
        <Route path="*paramName" component={NotFound} />
    </HashRouter>
)

export default Routing;