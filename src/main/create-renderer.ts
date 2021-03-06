import { StreamInterceptor } from './interceptors/stream-interceptor';

import { BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

import { InterceptorService } from './services/interceptor-service';

import { IframeOptionInterceptor } from './interceptors/iframe-option-interceptor';
import { AssetFileInterceptor } from './interceptors/asset-file-interceptor';
import { SaveDataInterceptor } from './interceptors/save-data-interceptor';
import { ResourceFileInterceptor } from './interceptors/resource-file-interceptor';
import { SmBeatInterceptor } from './interceptors/smbeat-interceptor';
import { OsApiFrameInterceptor } from './interceptors/osapi-frame-interceptor';

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

const interceptorService = new InterceptorService([
  new AssetFileInterceptor(),
  new SaveDataInterceptor(),
  new StreamInterceptor(),
  new ResourceFileInterceptor(),
  new SmBeatInterceptor(),
  // new OsApiFrameInterceptor(),
  new IframeOptionInterceptor(),
]);

export const createRenderer = (
  onCreate: (win: BrowserWindow) => void , 
  onClose: () => void
) => async () => {
  if (process.env.NODE_ENV !== 'production') {
    await installExtensions();
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
    }
  });

  interceptorService.apply(win);

  if (process.env.NODE_ENV !== 'production') {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';
    win.loadURL(`http://localhost:2003`);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
    win.setMenu(null);
  }

  if (process.env.NODE_ENV !== 'production') {
    // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
    win.webContents.once('dom-ready', () => {
      win!.webContents.openDevTools();
    });
  }
  onCreate(win);
  win.on('closed', onClose);
};
