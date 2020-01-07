import { PathService } from '../services';
import { IHeadersReceived, MetadataResourceType } from '@main/models';

export class StreamInterceptor implements IHeadersReceived {
  private readonly _pathService = new PathService();
  
  public filter: Electron.Filter = {
    urls: [`${MetadataResourceType.Stream}://asset/*`]
  }
  
  public headersReceived(
    details: Electron.OnHeadersReceivedListenerDetails, 
    callback: (headersReceivedResponse: Electron.HeadersReceivedResponse) => void | null
  ): void | null {
    const filePath = details.url.substring(MetadataResourceType.Stream.length + 3).replace(/\?.*$/, '');
    callback({});
  }
}