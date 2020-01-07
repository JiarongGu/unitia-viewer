import { app, BrowserWindow, protocol } from 'electron';

import { createRenderer } from './create-renderer';
import { createProtocol } from './create-protocol';
import { MetadataResourceType } from './models';

let renderer: BrowserWindow | null;

const createWindow = createRenderer(
  win => renderer = win, 
  () => renderer = null
);


protocol.registerSchemesAsPrivileged([{
  scheme: MetadataResourceType.File,
  privileges: { secure: true, standard: true, supportFetchAPI: true }
},{
  scheme: MetadataResourceType.Stream,
  privileges: { secure: true, standard: true, supportFetchAPI: true }
}]);

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
