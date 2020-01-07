export enum InterceptorEvent {
  onBeforeRequest = 'onBeforeRequest',
  onBeforeSendHeaders = 'onBeforeSendHeaders',
  onSendHeaders = 'onSendHeaders',
  onHeadersReceived = 'onHeadersReceived',
  onResponseStarted = 'onResponseStarted',
  onBeforeRedirect = 'onBeforeRedirect',
  onCompleted = 'onCompleted',
  onErrorOccurred = 'onErrorOccurred',
}