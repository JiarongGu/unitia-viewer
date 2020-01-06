import { Filter } from 'electron';
import * as _ from 'lodash';

import { HeadersReceivedInterceptor } from '@main/models';

export class IframeOptionInterceptor extends HeadersReceivedInterceptor {
  public filter: Filter = {
    urls: [
      'http://pc-play.games.dmm.co.jp/*',
      'https://*.dmm.co.jp/*'
    ]
  };

  public listener(
    details: Electron.OnHeadersReceivedListenerDetails,
    callback: (headersReceivedResponse: Electron.HeadersReceivedResponse) => void) {
    const responseHeaders = _.pickBy(details.responseHeaders, (_, key) => key !== 'x-frame-options');
    callback({ responseHeaders, cancel: false });
  };
}