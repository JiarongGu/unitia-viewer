import { OnBeforeSendHeadersListenerDetails, BeforeSendResponse } from 'electron';
import { InterceptorContext } from '../interceptor-context';

export interface IBeforeSendHeaders {
  filters: Array<string>;
  beforeSendHeaders(
    details: OnBeforeSendHeadersListenerDetails, 
    context: InterceptorContext<BeforeSendResponse>
  ): Promise<BeforeSendResponse | void>;
}