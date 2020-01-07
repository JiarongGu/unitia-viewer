import { Filter, OnBeforeSendHeadersListenerDetails, BeforeSendResponse } from 'electron';

export interface IBeforeSendHeaders {
  filter: Filter | null;
  beforeSendHeaders(
    details: OnBeforeSendHeadersListenerDetails,
    callback: (beforeSendResponse: BeforeSendResponse) => void
  ): Promise<void> | void | null;
}