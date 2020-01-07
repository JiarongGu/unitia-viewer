import { BrowserWindow } from 'electron';
import * as _ from 'lodash';

import { Interceptor, InterceptorEvent } from '@main/models';

export class InterceptorService {
  private static interceptorEventHandler = {
    [InterceptorEvent.onBeforeSendHeaders]: 'beforeSendHeaders',
    [InterceptorEvent.onBeforeRequest]: 'beforeRequest',
    [InterceptorEvent.onSendHeaders]: 'sendHeaders',
    [InterceptorEvent.onHeadersReceived]: 'headersReceived',
    [InterceptorEvent.onResponseStarted]: 'responseStarted',
    [InterceptorEvent.onBeforeRedirect]: 'beforeRedirect',
    [InterceptorEvent.onCompleted]: 'completed',
  };

  private interceptors: Array<Interceptor>;

  constructor(interceptors: Array<Interceptor>) {
    this.interceptors = interceptors;
  }

  public apply(win: BrowserWindow) {
    this.interceptors.forEach(interceptor => {
      const events = _.values(InterceptorEvent);
      
      events.forEach(event => {
        this.applyInterceptor(event, win, interceptor);
      });
    });
  }

  private applyInterceptor(event: InterceptorEvent, win: BrowserWindow, interceptor: Interceptor) {
    const handler = interceptor[InterceptorService.interceptorEventHandler[event]]
    if (handler && typeof(win.webContents.session.webRequest[event]) === 'function') {
      if (interceptor.filter != null) {
        (win.webContents.session.webRequest[event] as any)(interceptor.filter, handler.bind(interceptor));
      } else {
        (win.webContents.session.webRequest[event] as any)(handler.bind(interceptor));
      }
    }
  }
}