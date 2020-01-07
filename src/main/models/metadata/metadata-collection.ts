import { MetadataModel } from './metadata-model';

export interface MetadataCollection {
  [key: string]: Array<MetadataModel> | MetadataCollection
}