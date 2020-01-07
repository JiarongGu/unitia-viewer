import { Filter, UploadData } from 'electron';
import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';
import * as download from 'download-file';

import { IBeforeRequest, ICompleted, MetadataResourceType, IBeforeSendHeaders } from '@main/models';
import { FileService, PathService } from '@main/services';
import { MetadataRepository } from './../repositories/metadata-repository';

export class AssetFileInterceptor implements IBeforeSendHeaders, IBeforeRequest, ICompleted {
  private readonly _fileService = new FileService();
  private readonly _pathService = new PathService();
  private readonly _metadataRepository = new MetadataRepository();
  private readonly _context = new Map<number, {
    requestHeaders: Record<string, string>
  }>();

  private _processing = new Map<number, {
    data: Array<UploadData>,
    headers?: Record<string, string>
  }>();

  public filter: Filter = {
    urls: [
      'https://front-r.game-unitia.net/*',
    ]
  };

  public beforeRequest(
    details: Electron.OnBeforeRequestListenerDetails,
    callback: (response: Electron.Response) => void
  ) {
    const filePath = this.getFilePath(details.url);
    const metadata = this._metadataRepository.getMetadata(filePath);
    const isSize = details.url.indexOf('SizeInfo.bytes') > 0;
    if (!isSize && metadata) {
      callback({ cancel: false, redirectURL: `${metadata.resourceType}://${filePath}` });
    } else {
      callback({});
    }
  }

  public beforeSendHeaders(
    details: Electron.OnBeforeSendHeadersListenerDetails, 
    callback: (beforeSendResponse: Electron.BeforeSendResponse) => void
  ): void | null {
    this._context.set(details.id, { requestHeaders: details.requestHeaders });
    callback({ requestHeaders: details.requestHeaders });
  }

  public completed(details: Electron.OnCompletedListenerDetails) {
    const filePath = this.getFilePath(details.url);
    const absolutePath = this._pathService.getResourcePath(filePath);
    const headers = details.responseHeaders;
    const context = this._context.get(details.id);

    if (_.get(headers, 'Content-Type.0') === 'binary/octet-stream') {
      const directory = path.dirname(absolutePath);
      const filename = path.basename(absolutePath);

      fs.ensureDir(directory).then(() => {
        download(details.url, { filename, directory }, async (err) => {
          if (!err) {
            await this._metadataRepository.saveMetadata(filePath, {
              filePath,
              requestUrl: details.url,
              requestMethod: details.method,
              requestHeaders: context?.requestHeaders,
              resourceType: MetadataResourceType.Stream,
              responseHeaders: headers,
            });
          }
        });
      });
    } else {
      axios.request({
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
          requestHeaders: context?.requestHeaders,
          resourceType: MetadataResourceType.File,
          responseHeaders: headers,
        });
      });
    }
    this._context.delete(details.id);
  }

  private getFilePath(url: string) {
    return path.join('asset', new URL(url, 'https://front-r.game-unitia.net/').pathname);
  }
}