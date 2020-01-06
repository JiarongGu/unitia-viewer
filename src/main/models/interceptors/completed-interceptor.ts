import { InterceptorType } from './interceptor-type.enum';
import { Filter, OnCompletedListenerDetails } from 'electron';

export abstract class CompletedInterceptor {
  public readonly type = InterceptorType.Completed;

  public abstract filter: Filter | null;
  public abstract listener (details: OnCompletedListenerDetails);
}
