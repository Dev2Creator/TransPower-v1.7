const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');

// Register scheme as standard to fix relative paths like CSS/JS
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } }
]);

app.whenReady().then(() => {
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      const parsedUrl = new URL(request.url);
      let requestPath = parsedUrl.pathname;
      if (requestPath.startsWith('/')) {
        requestPath = requestPath.substring(1);
      }
      
      let filePath = path.join(__dirname, 'www', requestPath);
      
      // If it's a directory (or root), serve index.html
      if (requestPath === '' || requestPath === '/') {
        filePath = path.join(__dirname, 'www', 'index.html');
      }
      
      callback({ path: filePath });
    } catch (e) {
      console.error('Protocol error:', e);
    }
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
