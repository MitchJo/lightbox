import { Component } from "solid-js"
import './style.css';

interface IModal{
    children: any;
    ref: any;
}

const Modal: Component<IModal> = (props: IModal) => {
    return <dialog class="modal-container" ref={props.ref}>
        {props.children}
    </dialog>
}

export default Modal;