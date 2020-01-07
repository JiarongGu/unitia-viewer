import { Filter, OnHeadersReceivedListenerDetails, HeadersReceivedResponse } from 'electron';

export interface IHeadersReceived {
  filter: Filter | null;
  headersReceived(
    details: OnHeadersReceivedListenerDetails,
    callback: (headersReceivedResponse: HeadersReceivedResponse) => void | null
  ): Promise<void> | void | null;
}