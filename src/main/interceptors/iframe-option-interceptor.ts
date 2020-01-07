
import { Filter } from 'electron';
import * as _ from 'lodash';

import { IHeadersReceived } from '@main/models';

export class IframeOptionInterceptor implements IHeadersReceived {
  public filter: Filter = {
    urls: ['https://*.dmm.co.jp/*']
  };

  public headersReceived(
    details: Electron.OnHeadersReceivedListenerDetails,
    callback: (headersReceivedResponse: Electron.HeadersReceivedResponse) => void
  ) {
    const responseHeaders = _.pickBy(details.responseHeaders, 
      (_, key) => key !== 'x-frame-options' && key !== 'X-Frame-Options'
    );
    callback({ responseHeaders, cancel: false });
  };
}