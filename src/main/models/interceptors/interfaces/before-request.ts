import { Filter, OnBeforeRequestListenerDetails, Response as ElectronResponse } from 'electron';

export interface IBeforeRequest {
  filter: Filter | null;
  beforeRequest(
    details: OnBeforeRequestListenerDetails,
    callback: (response: ElectronResponse) => void
  ): void | null;
}