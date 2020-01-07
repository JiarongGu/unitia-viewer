import { PathService } from '../services';
import { IHeadersReceived, MetadataResourceType } from '@main/models';

export class StreamInterceptor implements IHeadersReceived {
  private readonly _pathService = new PathService();
  
  public filter: Electron.Filter = {
    urls: [`${MetadataResourceType.Stream}://*`]
  }
  
  
  public headersReceived(
    details: Electron.OnHeadersReceivedListenerDetails, 
    callback: (headersReceivedResponse: Electron.HeadersReceivedResponse) => void | null
  ): void | null {
    const filePath = this.getResourcePath(details.url, MetadataResourceType.File).replace(/\?.*$/, '');
    console.log(details, filePath);
    callback({});
  }

  private getResourcePath (url: string, type: MetadataResourceType) {
    const filePath = url.substring(type.length + 3);
    return this._pathService.getResourcePath(filePath);
  }
}