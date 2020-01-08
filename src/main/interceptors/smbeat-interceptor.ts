import * as _ from 'lodash';
import { InterceptorContext, MetadataResourceType, IBeforeRequest } from '@main/models';

export class SmBeatInterceptor implements IBeforeRequest {
  public filters = ['https://api.smbeat.jp/api/errors'];

  public async beforeRequest(
    details: Electron.OnBeforeRequestListenerDetails, 
    context: InterceptorContext<Electron.Response>
  ): Promise<void | Electron.Response> {
    return { cancel: false, redirectURL:  `${MetadataResourceType.Mock}://${details.url.substring(8)}` };
  }
}