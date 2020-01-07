import * as path from 'path';
import axios from 'axios';
import * as _ from 'lodash';

import { ICompleted, MetadataResourceType, IBeforeSendHeaders } from '@main/models';
import { FileService, PathService } from '@main/services';
import { SaveDataRepository } from '@main/repositories/savedata-repository';

export class SaveDataInterceptor implements IBeforeSendHeaders, ICompleted {
  private readonly _fileService = new FileService();
  private readonly _pathService = new PathService();
  private readonly _metadataRepository = new SaveDataRepository();
  private readonly _context = new Map<number, {
    requestHeaders: Record<string, string>
  }>();

  public filter: Electron.Filter = {
    urls: ['https://r.game-unitia.net/v1/*']
  }

  public beforeRequest(
    details: Electron.OnBeforeRequestListenerDetails,
    callback: (response: Electron.Response) => void
  ) {
    const filePath = this.getFilePath(details.url);
    const metadata = this._metadataRepository.getMetadata(filePath);

    if (metadata) {
      callback({ cancel: false, redirectURL: `${MetadataResourceType.File}://${filePath}` });
    } else {
      callback({});
    }
  }

  beforeSendHeaders(
    details: Electron.OnBeforeSendHeadersListenerDetails, 
    callback: (beforeSendResponse: Electron.BeforeSendResponse) => void
  ): void | null {
    this._context.set(details.id, { requestHeaders: details.requestHeaders });
    callback({ requestHeaders: details.requestHeaders });
  }

  completed(details: Electron.OnCompletedListenerDetails) {
    const filePath = this.getFilePath(details.url);
    const absolutePath = this._pathService.getResourcePath(filePath);
    const context = this._context.get(details.id);

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
      console.log(details.url);
    });

    this._context.delete(details.id);
  }

  private getFilePath(url: string) {
    return path.join('save', `${new URL(url, 'https://r.game-unitia.net/').pathname}.sav`);
  }
}