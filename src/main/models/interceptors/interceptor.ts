import { IHeadersReceived, IBeforeRequest, ICompleted, IBeforeSendHeaders } from './interfaces';

export type Interceptor = { filters: Array<string> } &
  Partial<IHeadersReceived> &
  Partial<IBeforeRequest> &
  Partial<ICompleted> &
  Partial<IBeforeSendHeaders>;