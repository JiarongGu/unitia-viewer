import { IHeadersReceived, IBeforeRequest, ICompleted, IBeforeSendHeaders } from './interfaces';



export type Interceptor =
  Partial<IHeadersReceived> &
  Partial<IBeforeRequest> &
  Partial<ICompleted> &
  Partial<IBeforeSendHeaders>;