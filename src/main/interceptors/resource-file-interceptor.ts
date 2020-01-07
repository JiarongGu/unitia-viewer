import * as _ from 'lodash';

import { MetadataRepository } from '../repositories/metadata-repository';
import { MetadataResourceType, IBeforeRequest, InterceptorContext } from '@main/models';

export class ResourceFileInterceptor implements IBeforeRequest {
  private readonly _assetRepository = new MetadataRepository();

  public filters = [`${MetadataResourceType.File}://asset/*`];


  public async beforeRequest(
    details: Electron.OnBeforeRequestListenerDetails, 
    context: InterceptorContext<Electron.Response>
  ): Promise<void | Electron.Response> {
    const filePath = details.url.substring(MetadataResourceType.File.length + 3).replace(/\?.*$/, '');
    const metadata = await this._assetRepository.getMetadata(filePath);

    if (!metadata) {
      const uri = filePath.replace('asset', '');
      return { cancel: false, redirectURL: `https://front-r.game-unitia.net${uri}` };
    }
  }
}