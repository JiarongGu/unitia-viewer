import * as path from 'path';
import axios from 'axios';
import * as _ from 'lodash';

import { ICompleted, MetadataResourceType, IBeforeRequest, InterceptorContext } from '@main/models';
import { FileService, PathService } from '@main/services';
import { SaveDataRepository } from '@main/repositories/savedata-repository';

export class SaveDataInterceptor implements IBeforeRequest, ICompleted {
  private readonly _fileService = new FileService();
  private readonly _pathService = new PathService();
  private readonly _metadataRepository: SaveDataRepository;

  constructor() {
    this._metadataRepository = new SaveDataRepository();
  }

  public filters = ['https://r.game-unitia.net/v1/*'];

  public async beforeRequest(details: Electron.OnBeforeRequestListenerDetails) {
    const filePath = this.getFilePath(details.url);
    const metadata = this._metadataRepository.getMetadata(filePath);

    if (metadata) {
      return { cancel: false, redirectURL: `${MetadataResourceType.File}://${filePath}` }
    }
  }

  public async completed(details: Electron.OnCompletedListenerDetails, context: InterceptorContext) {
    const filePath = this.getFilePath(details.url);
    const absolutePath = this._pathService.getResourcePath(filePath);
    
    axios.request({
      headers: context?.requestHeaders,
      method: details.method as any,
      url: details.url,
      withCredentials: true,
      responseType: 'arraybuffer'
    }).then(response => {
      return this._fileService.save(absolutePath, response.data);
    }).then(() => {
      return this._metadataRepository.saveMetadata(filePath, {
        filePath,
        requestUrl: details.url,
        requestMethod: details.method,
        resourceType: MetadataResourceType.File,
      });
    }).catch(error => {
      console.log('save error:: ', details.url);
    });
  }

  private getFilePath(url: string) {
    return path.join('save', `${new URL(url, 'https://r.game-unitia.net/').pathname}.sav`);
  }
}