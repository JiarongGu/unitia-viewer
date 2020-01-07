import { app, BrowserWindow } from 'electron';

import { createRenderer } from './create-renderer';
import { createProtocol } from './create-protocol';

let renderer: BrowserWindow | null;

const createWindow = createRenderer(
  win => renderer = win, 
  () => renderer = null
);

app.on('ready', () => {
  app.commandLine.appendSwitch('disable-site-isolation-trials');
  createProtocol();
  createWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (renderer === null) {
    createWindow();
  }
});
