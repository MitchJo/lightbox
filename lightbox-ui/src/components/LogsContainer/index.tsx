import { Component } from "solid-js";
import './style.css'

interface ILogsContainer{
    logs: string;
    onRefresh: () => void;
    onClose: () => void;
}

const LogsContainer: Component<ILogsContainer> = (props: ILogsContainer) => {
    return <div class="log-container">
        <div class="actions">
            <button class="border border-primary" onClick={props.onRefresh}>Refresh Logs</button>
            <button class="primary" onClick={props.onClose}>Close</button>
        </div>
        <pre>{props?.logs || 'No logs yet...'}</pre>
    </div>
}

export default LogsContainer