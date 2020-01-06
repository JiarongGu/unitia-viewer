import { InterceptorType } from './interceptor-type.enum';
import { Filter, OnBeforeRequestListenerDetails, Response as ElectronResponse } from 'electron';

export abstract class BeforeRequestInterceptor {
  public readonly type = InterceptorType.BeforeRequest;

  public abstract filter: Filter | null;
  public abstract listener(
    details: OnBeforeRequestListenerDetails,
    callback: (response: ElectronResponse) => void
  ): void | null;
}