import { Filter, UploadData } from 'electron';
import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';
import * as download from 'download-file';

import { IBeforeRequest, ICompleted, MetadataResourceType } from '@main/models';
import { FileService, PathService } from '@main/services';
import { MetadataRepository } from './../repositories/metadata-repository';

export class AssetFileInterceptor implements IBeforeRequest, ICompleted {
  private _fileService = new FileService();
  private _pathService = new PathService();
  private readonly _metadataRepository = new MetadataRepository();

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

  public completed(details: Electron.OnCompletedListenerDetails) {
    const filePath = this.getFilePath(details.url);
    const absolutePath = this._pathService.getResourcePath(filePath);
    const headers = details.responseHeaders;

    if (_.get(headers, 'Content-Type.0') === 'binary/octet-stream') {
      console.log(`streaming type: ${details.url}`);
      const directory = path.dirname(absolutePath);
      const filename = path.basename(absolutePath);

      fs.ensureDir(directory).then(() => {
        download(details.url, { filename, directory }, async (err) => {
          if (!err) {
            await this._metadataRepository.saveMetadata(filePath, {
              filePath,
              requestUrl: details.url,
              requestMethod: details.method,
              requestHeaders: details.responseHeaders,
              resourceType: MetadataResourceType.Stream,
              responseHeaders: headers,
            });
            console.log(`downloaded ${filePath}`);
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
          requestHeaders: details.responseHeaders,
          resourceType: MetadataResourceType.File,
          responseHeaders: headers,
        });
      });
    }
    this._processing.delete(details.id);
  }

  private getFilePath(url: string) {
    return path.join('asset', new URL(url, 'https://front-r.game-unitia.net/').pathname);
  }
}