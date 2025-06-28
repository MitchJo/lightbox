import { Component, onCleanup, onMount } from "solid-js";
import iro from '@jaames/iro';
import './style.css';

interface IColorWheel{
    onColorChange: (e: any) => void;
    onSendColor: (e: any) => void;
}

const ColorWheel: Component<IColorWheel> = (props: IColorWheel) => {
    let colorPickerElement: any;
    let colorPicker: any;

    const initializeWheel = (element: HTMLElement) =>{
        const picker = iro.ColorPicker(element,{
            width: 320,
            color: "#f5f5f5"
        })  

        picker.on('input:end',(color: any)=>{
            const {r,g,b} = color.rgb;
            props.onSendColor({red: r, green:g, blue:b})
        })

        picker.on('color:change',(color: any)=>{
            props.onColorChange(color.rgbaString)
        })

        return picker;
    }

    onMount(() => {
        if(colorPickerElement) colorPicker = initializeWheel(colorPickerElement);
    })

    onCleanup(() => {
        colorPicker=null;
    })


    return <div class="color-wheel-container" >
        <h3>Light Colour</h3>
        <div class="color-wheel" ref={colorPickerElement} />
    </div>
}

export default ColorWheel;