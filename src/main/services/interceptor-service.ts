import { BrowserWindow } from 'electron';

import { Interceptor, InterceptorType } from '@main/models';

export class InterceptorService {
  private interceptors: Array<Interceptor>;

  constructor(interceptors: Array<Interceptor>) {
    this.interceptors = interceptors;
  }

  public apply(win: BrowserWindow) {
    this.interceptors.forEach(interceptor => {

      if (interceptor.type === InterceptorType.HeaderReceived) {
        if (interceptor.filter != null) {
          win.webContents.session.webRequest.onHeadersReceived(interceptor.filter, interceptor.listener);
        } else {
          win.webContents.session.webRequest.onHeadersReceived(interceptor.listener);
        }
      }

      if (interceptor.type === InterceptorType.BeforeRequest) {
        if (interceptor.filter != null) {
          win.webContents.session.webRequest.onBeforeRequest(interceptor.filter, interceptor.listener);
        } else {
          win.webContents.session.webRequest.onBeforeRequest(interceptor.listener);
        }
      }

      if (interceptor.type === InterceptorType.Completed) {
        if (interceptor.filter != null) {
          win.webContents.session.webRequest.onCompleted(interceptor.filter, interceptor.listener);
        } else {
          win.webContents.session.webRequest.onCompleted(interceptor.listener);
        }
      }
    });
  }

  
}