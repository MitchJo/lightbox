import { Component, createEffect, createSignal, on } from "solid-js";
import './style.css';

interface IFormFileInput {
    filePath: string;
    fileType: string;
    parameters?: any
}

const FormFileInput: Component<IFormFileInput> = (props: IFormFileInput) => {

    const [fakepath,setFakePath] = createSignal('');

    const handleOnChange = (e: any) => {
        const {target: {value}} = e;
        setFakePath(value||'')
    }

    createEffect(on(
        ()=> props.filePath,
        ()=> setFakePath(props?.filePath || '')
    ))

    return <div class="input-file-group" classList={{
        'no-file': fakepath().length === 0
    }}>
        <span>{fakepath().length ? fakepath() : 'Choose a file...'}</span>
        <input type="file" class="overlay" accept={props.fileType} {...props.parameters} required={props.filePath.length === 0} onChange={handleOnChange}/>
    </div>
}

export default FormFileInput;