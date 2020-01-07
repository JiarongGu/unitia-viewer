import { IframeOptionInterceptor } from './../interceptors/iframe-option-interceptor';
import {
  BrowserWindow,
  Filter,
  OnBeforeSendHeadersListenerDetails,
  BeforeSendResponse,
  OnBeforeRequestListenerDetails,
  Response as ElectronResponse,
  OnCompletedListenerDetails,
  OnHeadersReceivedListenerDetails,
  HeadersReceivedResponse
} from 'electron';
import * as _ from 'lodash';
import * as matchUrlWildcard from 'match-url-wildcard';

import { Interceptor, InterceptorContext } from '@main/models';

export class InterceptorService {
  private _interceptors: Array<Interceptor>;
  private _filter: Filter;
  private _contexts = new Map<number, InterceptorContext>();

  constructor(interceptors: Array<Interceptor>) {
    this._interceptors = interceptors;
    this._filter = { urls: interceptors.flatMap(i => i.filters) }
  }

  public apply(win: BrowserWindow) {
    win.webContents.session.webRequest.onBeforeSendHeaders(this._filter,
      (details, callback) => this.beforeSendHeaders(details, callback)
    );
    win.webContents.session.webRequest.onBeforeRequest(this._filter,
      (details, callback) => this.beforeRequest(details, callback)
    );
    win.webContents.session.webRequest.onHeadersReceived(this._filter,
      (details, callback) => this.headersReceived(details, callback)
    );
    win.webContents.session.webRequest.onCompleted(this._filter,
      (details) => this.completed(details)
    );
  }

  public async beforeSendHeaders(
    details: OnBeforeSendHeadersListenerDetails,
    callback: (beforeSendResponse: BeforeSendResponse) => void
  ) {
    const interceptors = this._interceptors
      .filter(i => i.beforeSendHeaders && (matchUrlWildcard as any)(details.url, i.filters));

    const context: InterceptorContext = {
      requestHeaders: details.requestHeaders,
      result: { requestHeaders: details.requestHeaders }
    }

    for (const interceptor of interceptors) {
      const result = await interceptor.beforeSendHeaders!(details, context);
      if (result) context.result = result;
    }

    callback(context.result);
    this._contexts.set(details.id, _.omitBy(context, 'result'));
  }

  public async beforeRequest(
    details: OnBeforeRequestListenerDetails,
    callback: (response: ElectronResponse) => void
  ) {
    const interceptors = this._interceptors
      .filter(i => i.beforeRequest && (matchUrlWildcard as any)(details.url, i.filters));

    const context = this._contexts.get(details.id) || {};

    for (const interceptor of interceptors) {
      const result = await interceptor.beforeRequest!(details, context);
      if (result) context.result = result;
    }

    callback(context.result);
    this._contexts.set(details.id, _.omitBy(context, 'result'));
  }

  public async headersReceived(
    details: OnHeadersReceivedListenerDetails,
    callback: (headersReceivedResponse: HeadersReceivedResponse) => void
  ) {
    const interceptors = this._interceptors
      .filter(i => i.headersReceived && (matchUrlWildcard as any)(details.url, i.filters));

    const context = this._contexts.get(details.id) || { responseHeaders: details.responseHeaders };

    for (const interceptor of interceptors) {
      const result = await interceptor.headersReceived!(details, context);
      if (result) context.result = result;
    }

    callback(context.result);
    this._contexts.set(details.id, _.omitBy(context, 'result'));
  }

  public async completed(details: OnCompletedListenerDetails) {
    const interceptors = this._interceptors
      .filter(i => i.completed && (matchUrlWildcard as any)(details.url, i.filters));

    const context: any = this._contexts.get(details.id);

    for (const interceptor of interceptors) {
      await interceptor.completed!(details, context);
    }
    this._contexts.delete(details.id);
  }
}