const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

// Custom protocol to bypass file:// restrictions for Web Workers and WASM
app.whenReady().then(() => {
  protocol.registerFileProtocol('app', (request, callback) => {
    let requestUrl = request.url.replace('app://', '');
    // Handle query params or hashes
    requestUrl = requestUrl.split('?')[0].split('#')[0];
    
    let filePath = path.normalize(`${__dirname}/www/${requestUrl}`);
    // If it's a directory (or root), serve index.html
    if (requestUrl === '' || requestUrl === '/') {
      filePath = path.normalize(`${__dirname}/www/index.html`);
    }
    
    callback({ path: filePath });
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true // Important to keep true, the custom protocol handles CORS
    },
    autoHideMenuBar: true
  });

  // Load the index.html via the custom protocol
  mainWindow.loadURL('app://index.html');
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
