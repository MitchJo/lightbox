
const { app, BrowserWindow } = require('electron/main')
const isDev = true;
const path = require('node:path');
const { mqttHelpers } = require('./main');
const { initializeHandlers } = require('./handlers');

if (process.platform === 'win32') {
    app.setAppUserModelId(app.getName());
}

const createWindow = () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
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
        // win.loadFile(path.join(__dirname, '../build/index.html'));
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

    initializeHandlers(app);


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

})

app.on('window-all-closed', () => {
    mqttHelpers.setMainWindow(null);

    if (process.platform !== 'darwin') {
        app.quit()
    }
})