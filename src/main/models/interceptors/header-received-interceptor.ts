import { InterceptorType } from './interceptor-type.enum';
import { Filter, OnHeadersReceivedListenerDetails, HeadersReceivedResponse } from 'electron';

export abstract class HeadersReceivedInterceptor {
  public readonly type = InterceptorType.HeaderReceived;

  public abstract filter: Filter | null;
  public abstract listener(
    details: OnHeadersReceivedListenerDetails,
    callback: (headersReceivedResponse: HeadersReceivedResponse) => void | null
  ): void;
}