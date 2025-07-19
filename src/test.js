const {bleHelpers} = require('./main');

async function scan(){
    await bleHelpers.bleStartScan();
}

process.on('SIGINT', bleHelpers.bleCleanUp);
process.on('SIGQUIT', bleHelpers.bleCleanUp);
process.on('SIGTERM', bleHelpers.bleCleanUp);

scan()