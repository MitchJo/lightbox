
const { app, BrowserWindow } = require('electron/main')
const isDev = false;
const path = require('node:path');
const { mqttHelpers, wifiConnectionHelpers, bleHelpers } = require('./main');
const { initializeHandlers } = require('./handlers');

if (process.platform === 'win32') {
    app.setAppUserModelId(app.getName());
}

const createWindow = () => {
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'lightbox.ico'),
        autoHideMenuBar: true
        // menuBarVisible: false
    })

    if (isDev) {
        win.loadURL('http://localhost:3000'); 
        win.webContents.openDevTools();
    } else {
        win.loadFile('src/ui/index.html');
    }

    

    win.on('close', () => {
        win = null;
    })

    return win;
}

app.whenReady().then(() => {
    const mainWindow = createWindow();

    mqttHelpers.setMainWindow(mainWindow);
    wifiConnectionHelpers.setMainWindow(mainWindow);
    bleHelpers.setMainWindow(mainWindow);

    initializeHandlers(app);


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

})

app.on('window-all-closed', () => {
    mqttHelpers.setMainWindow(null);
    wifiConnectionHelpers.setMainWindow(null);
    bleHelpers.setMainWindow(null);

    bleHelpers.bleCleanUp();

    if (process.platform !== 'darwin') {
        app.quit()
    }
})