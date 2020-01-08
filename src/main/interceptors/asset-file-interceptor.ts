import * as _ from 'lodash';
import * as fs from 'fs-extra';
import * as path from 'path';
import axios from 'axios';
import * as download from 'download-file';

import { IBeforeRequest, ICompleted, MetadataResourceType } from '@main/models';
import { FileService, PathService } from '@main/services';
import { MetadataRepository } from './../repositories/metadata-repository';

export class AssetFileInterceptor implements IBeforeRequest, ICompleted {
  private readonly _fileService = new FileService();
  private readonly _pathService = new PathService();
  private readonly _metadataRepository = new MetadataRepository();
  public filters = ['https://front-r.game-unitia.net/*', 'http://front-r.game-unitia.net/*'];

  public async beforeRequest(
    details: Electron.OnBeforeRequestListenerDetails
  ) {
    const filePath = this.getFilePath(details.url);
    const metadata = await this._metadataRepository.getMetadata(filePath);
    const isSize = details.url.indexOf('SizeInfo.bytes') > 0;
    if (metadata) {
      if (!isSize) {
        return { cancel: false, redirectURL: `${MetadataResourceType.File}://${filePath}` }
      }
      return { cancel: false, redirectURL: `${MetadataResourceType.Stream}://${filePath}` }
    }
  }

  public async completed(details: Electron.OnCompletedListenerDetails, context) {
    const filePath = this.getFilePath(details.url);
    const absolutePath = this._pathService.getResourcePath(filePath);
    const headers = details.responseHeaders;

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
              resourceType: MetadataResourceType.Stream,
              responseHeaders: details.responseHeaders
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
          resourceType: MetadataResourceType.File,
          responseHeaders: details.responseHeaders
        });
      });
    }
  }

  private getFilePath(url: string) {
    return path.join('asset', new URL(url, 'https://front-r.game-unitia.net/').pathname);
  }
}