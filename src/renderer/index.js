connectMqtt.addEventListener('click', async (e) => {
    await window.versions.mqttConnect();
})

disconnectMqtt.addEventListener('click', async(e) => {
    await window.versions.mqttDisconnect();
});

mqttFormParameters.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    let data = {};
    let files = [];

    for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
            files.push({ key, file: value });
        } else {
            data[key] = value;
        }
    }

    const readFileAsArrayBuffer = (file) => {
        return new Promise((resolve, reject) => {

            if (file.size > 100 * 1024 * 1024) {
                return reject(new Error(`File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Max 100 MB allowed.`));
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });

    };


    try {
        const readPromises = files.map(async ({ key, file }) => {
            const arrayBuffer = await readFileAsArrayBuffer(file);
            return {
                formKey: key,
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
                data: arrayBuffer
            };
        });

        const processedFiles = await Promise.all(readPromises);

        processedFiles.forEach((e) => {
            data = { ...data, [e.formKey]: e.data }
        })

        await window.versions.setConfiguration(data);

        settingsContainer.close('cancelled');

    } catch (e) {
        console.log(e)
    }

});

showSettings.addEventListener('click',(e)=>{
    getConfiguration();
    const isOpen = settingsContainer.getAttribute('open');
    if(isOpen) {
        settingsContainer.close('cancelled');
    }
    else{
        settingsContainer.showModal()
    }
});

showSettings.addEventListener('close', () => {
    console.log('Close Settings', showSettings.returnValue)
});

closeSettings.addEventListener('click',(e)=>{
    setTimeout(() => {
        settingsContainer.close('cancelled');
    }, 10);
})

function handleConnection(data){
    const {connected} = data;
    if(connected) {
        mqttFormParameters.classList.add('hide');
        connectMqtt.classList.add('hide');
        disconnectMqtt.classList.remove('hide');
        colorChooser.classList.remove('hide');
        brightnessController.classList.remove('hide');
        topicName.classList.remove('hide');
    }else{
        mqttFormParameters.classList.remove('hide');
        connectMqtt.classList.remove('hide');
        disconnectMqtt.classList.add('hide');
        colorChooser.classList.add('hide');
        brightnessController.classList.add('hide');
        topicName.classList.add('hide');
    }
}

function handleSubscription(data){

}

function handleMessage(data){

}

function handlePublish(data){
    console.log('Publish data')
    console.log(data);
}

function parseMqttEvents(value){
   const {type, data} = value;
   switch (type) {

    case 'connection':
        handleConnection(data);
        return;

    case 'subscription':
        handleSubscription(data);
        return;

    case 'publish':
        handlePublish(data);
        return;

    case 'message':
        handleMessage(data);
        return;
   
    default:
        return;
   }
}

function hexToRgb(color){
    color = color.replace(/^#/, '');

    if (color.length === 3) color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];

    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);

    return {red: r , green: g , blue: b};
}

window.versions.onMqttStatus((value) => {
    if(!value) return;
    try{
        const jsonValue = JSON.parse(value)
        parseMqttEvents(jsonValue);
    }catch(e){
        console.log(e)
    }
});

async function publishData(data){
    const {value} = topicName;
    if(!value.length) return;
    await window.versions.mqttPublish({topic: value, payload: JSON.stringify(data)});
}

colorChooser.addEventListener('change',(e)=>{
    const {target: {value}} = e;
    const rgb = hexToRgb(value);
    publishData({readCmd: 234, ...rgb});
})

brightnessController.addEventListener('change',(e)=>{
    const {target: {value}} = e;
    publishData({readCmd: 236, brightness: parseInt(value)});
});

async function getConfiguration(){
    const config = await window.versions.getConfiguration()
    console.log(config)
}