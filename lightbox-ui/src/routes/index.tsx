import { Router, Route, useLocation } from "@solidjs/router";
import Home from "../screens/Home";
import NotFound from "../screens/NotFound";
import App from "./App";

const Routing = () => (
    <Router root={App}>
        <Route path="/" component={Home} />
        <Route path="*paramName" component={NotFound} />
    </Router>
)

export default Routing;