import * as _ from 'lodash';

import { MetadataRepository } from './../repositories/metadata-repository';
import { IHeadersReceived, MetadataResourceType } from '@main/models';

export class StreamInterceptor implements IHeadersReceived {
  private readonly _assetRepository = new MetadataRepository();

  public filters = [`${MetadataResourceType.Stream}://asset/*`];

  public async headersReceived(details: Electron.OnHeadersReceivedListenerDetails) {
    const filePath = details.url.substring(MetadataResourceType.Stream.length + 3).replace(/\?.*$/, '');
    const metadata = await this._assetRepository.getMetadata(filePath);
    const headers = metadata?.responseHeaders && _.transform(metadata?.responseHeaders, (acc, curr, key) => {
      acc[key] = curr[0];
      return acc;
    }, {});
    if (metadata?.requestHeaders) {
      return { responseHeaders: headers };
    }
  }
}