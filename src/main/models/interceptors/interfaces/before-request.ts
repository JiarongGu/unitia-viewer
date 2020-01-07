import { OnBeforeRequestListenerDetails, Response as ElectronResponse } from 'electron';
import { InterceptorContext } from '../interceptor-context';

export interface IBeforeRequest {
  filters: Array<string>;
  beforeRequest(
    details: OnBeforeRequestListenerDetails, 
    context: InterceptorContext<ElectronResponse>
  ): Promise<ElectronResponse | void>;
}