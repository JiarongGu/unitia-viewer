export interface InterceptorContext<TResult = any> {
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  result?: TResult
}