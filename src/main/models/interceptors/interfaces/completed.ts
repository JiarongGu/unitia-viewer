import { OnCompletedListenerDetails } from 'electron';
import { InterceptorContext } from '../interceptor-context';

export interface ICompleted {
  filters: Array<string>;
  completed(details: OnCompletedListenerDetails, context: InterceptorContext<never>) : Promise<void>;
}
