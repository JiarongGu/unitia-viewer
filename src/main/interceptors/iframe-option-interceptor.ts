import * as _ from 'lodash';

import { IHeadersReceived } from '@main/models';

export class IframeOptionInterceptor implements IHeadersReceived {
  public filters = ['https://*.dmm.co.jp/*', 'http://osapi.dmm.com/*'];

  public async headersReceived(details: Electron.OnHeadersReceivedListenerDetails) {
    const responseHeaders = _.pickBy(details.responseHeaders,
      (_, key) => key !== 'x-frame-options' && key !== 'X-Frame-Options'
    );
    return { responseHeaders, cancel: false };
  };
}