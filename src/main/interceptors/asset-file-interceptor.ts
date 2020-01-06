
import { Filter } from 'electron';
import * as _ from 'lodash';

import { BeforeRequestInterceptor, CompletedInterceptor } from '@main/models';
import { FileService } from '@main/services';

export class BeforeAssetFileInterceptor extends BeforeRequestInterceptor {
  private _fileService = new FileService();

  public filter: Filter = {
    urls: [
      'https://front-r.game-unitia.net/AssetBundles/WebGL/*',
    ]
  };

  public listener(details: Electron.OnBeforeRequestListenerDetails, callback: (response: Electron.Response) => void) {
    callback({ cancel: false });
  }
}

export class CompletedAssetFileInterceptor extends CompletedInterceptor {
  private _fileService = new FileService();

  public filter: Filter = {
    urls: [
      'https://front-r.game-unitia.net/AssetBundles/WebGL/*',
    ]
  };

  public listener(details: Electron.OnCompletedListenerDetails){
    
  }
}