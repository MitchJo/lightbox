import { Component } from "solid-js";

import './style.css';

interface ITransitionSelector {
    onSelect: (e: any) => void;
}

const TransitionSelector: Component<ITransitionSelector> = (props: ITransitionSelector) => {
    return <div class="transition-container">
        <h4> Choose Transition:</h4>
        <select name="transition" id="" onChange={props.onSelect}>
            <option value="1" selected>Fade</option>
            <option value="2">Chase</option>
        </select>
    </div>
}

export default TransitionSelector;