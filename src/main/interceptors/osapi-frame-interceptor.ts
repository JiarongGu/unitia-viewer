import * as path from 'path';
import axios from 'axios';
import * as _ from 'lodash';

import { MetadataResourceType, InterceptorContext, ICompleted, IBeforeRequest } from '@main/models';
import { FileService, PathService } from '@main/services';
import { OsApiFrameRepository } from './../repositories/osapi-frame-repository';

export class OsApiFrameInterceptor implements ICompleted, IBeforeRequest {
  private readonly _fileService = new FileService();
  private readonly _pathService = new PathService();
  private readonly _metadataRepository = new OsApiFrameRepository();

  public filters = [
    'http://osapi.dmm.com/*',
    'http://frame/social/rpc',
    'resources-file://frame/gadgets/makeRequest'
  ];


  public async beforeRequest(details: Electron.OnBeforeRequestListenerDetails) {
    const filePath = this.getFilePath(details.url);
    const metadata = this._metadataRepository.getMetadata(filePath);
    const isIfr = metadata?.filePath.indexOf('ifr') || 0 > 0;
    if (metadata && !isIfr) {
      return { cancel: false, redirectURL: `${MetadataResourceType.File}://${metadata.filePath}` }
    }

    if (details.url.indexOf('gadgets/makeRequest') > -1) {
      return { cancel: false, redirectURL: `${MetadataResourceType.Mock}://osapi.dmm.com/gadgets/makeRequest` }
    }

    if (details.url.indexOf('social/rpc') > -1) {
      return { cancel: false, redirectURL: `${MetadataResourceType.Mock}://frame/social/rpc` }
    }

    if (details.url.indexOf('gadgets/makeRequest') > -1) {
      return { cancel: false, redirectURL: `${MetadataResourceType.Mock}://frame/gadgets/makeRequest` }
    }
  }

  public async completed(details: Electron.OnCompletedListenerDetails, context: InterceptorContext) {
    if (details.url.indexOf('resources-file') >= 0) {
      return;
    }

    const filePath = this.getFilePath(details.url);
    const absolutePath = this._pathService.getResourcePath(filePath);
    const url = new URL(details.url);


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
        searchParams: _.transform<any, any>(url.searchParams, (acc, curr, key) => (acc[key] = curr, acc), {})
      });
    }).catch(error => {
      console.log('frame error::', details.url);
    });
  }

  private getFilePath(url: string) {
    return path.join('frame', `${new URL(url, 'http://osapi.dmm.com/').pathname}`);
  }
}