import { MetadataRepository } from './repositories/metadata-repository';
import { protocol } from 'electron';
import * as fs from 'fs';

import { PathService } from './services';
import { MetadataResourceType } from './models';


export function createProtocol() {
  const pathService = new PathService();
  const repository = new MetadataRepository();
  
  const getFilePath = (url: string, type: MetadataResourceType) => {
    const filePath = url.substring(type.length + 3);
    return pathService.getResourcePath(filePath);
  }

  protocol.registerFileProtocol(MetadataResourceType.File, (request, callback) => {
    callback({
      path: getFilePath(request.url, MetadataResourceType.File)
    });
  }, (error) => {
    if (error) console.error('Failed to register file protocol')
  })

  protocol.registerStreamProtocol(MetadataResourceType.Stream, (request, callback) => {
    callback(fs.createReadStream(getFilePath(request.url, MetadataResourceType.Stream)));
  }, (error) => {
    if (error) console.error('Failed to register stream protocol')
  })
}