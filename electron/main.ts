import { app, BrowserWindow, screen } from 'electron'
import { join } from 'path'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let mainWindow: BrowserWindow | null

/**
 * Create electron window
 */
function createWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
    },
    width,
    height,
  })

  // Test active push message to Renderer-process.
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  mainWindow.loadFile(join(ROOT_PATH.dist, 'index.html'))
}

app.on('window-all-closed', () => {
  console.log('Closing application.')
  mainWindow = null
  app.quit()
})

app.whenReady().then(createWindow)
