import { BeforeRequestInterceptor } from './before-request-interceptor';
import { HeadersReceivedInterceptor } from './header-received-interceptor';
import { CompletedInterceptor } from './completed-interceptor';

export type Interceptor =
  HeadersReceivedInterceptor |
  BeforeRequestInterceptor |
  CompletedInterceptor;