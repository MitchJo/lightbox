import { Component } from "solid-js"

interface IHeader{
    onSettings: () => void;
    title: string
}

const Header: Component<IHeader> = (props: IHeader) => {
    return <header>
        <nav>
            <h1>{props.title}</h1>
            <button onClick={props.onSettings} class="default">Settings</button>
        </nav>
    </header>
}

export default Header;