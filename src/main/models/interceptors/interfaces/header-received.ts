import { OnHeadersReceivedListenerDetails, HeadersReceivedResponse, BeforeSendResponse } from 'electron';
import { InterceptorContext } from '../interceptor-context';

export interface IHeadersReceived {
  filters: Array<string>;
  headersReceived(
    details: OnHeadersReceivedListenerDetails, 
    context: InterceptorContext<BeforeSendResponse>
  ): Promise<HeadersReceivedResponse | void>;
}