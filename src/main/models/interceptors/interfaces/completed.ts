import { Filter, OnCompletedListenerDetails } from 'electron';

export interface ICompleted {
  filter: Filter | null;
  completed (details: OnCompletedListenerDetails);
}
