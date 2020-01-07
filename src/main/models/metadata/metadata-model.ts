import { MetadataResourceType } from './metadata-resource-type.enum';

export interface MetadataModel {
  requestUrl: string,
  requestMethod: string,
  requestHeaders?: Record<string, string>;
  resourceType: MetadataResourceType,
  responseHeaders?: Record<string, string>;
  searchParams?: Record<string, string>;
  filePath: string;
}