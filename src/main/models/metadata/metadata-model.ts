import { MetadataResourceType } from './metadata-resource-type.enum';

export interface MetadataModel {
  resourceType: MetadataResourceType,
  responseHeaders?: Record<string, string>;
  searchParams?: Record<string, string>;
  filePath: string;
}