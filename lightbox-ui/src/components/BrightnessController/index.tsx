import { Component, createSignal, onMount } from "solid-js";

import './style.css'

interface IBrightnessController {
    onChange: (e: any) => void;
    activeTrackColor: string;
    value: number;
}

const BrightnessController: Component<IBrightnessController> = (props: IBrightnessController) => {

    let slider: any;

    const updateSliderFill = () => {
        const min = slider.min ? parseFloat(slider.min) : 0;
        const max = slider.max ? parseFloat(slider.max) : 100;
        const value = parseFloat(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.setProperty('--fill-percentage', `${percentage}%`);
    }

    onMount(() => {
        if (slider) updateSliderFill();
    })


    return <div class="slider-wrapper">
        <h3>Brightness</h3>
        <div class="vertical-slider-container">
            <input type="range" min="20" max="250" value={props.value} step="1" ref={slider} class="brightness-slider vertical" onChange={props.onChange} onInput={updateSliderFill} style={{
                background: `linear-gradient(to right, ${props.activeTrackColor} var(--fill-percentage), #ccc var(--fill-percentage))`
            }} />
        </div>
    </div>
}

export default BrightnessController