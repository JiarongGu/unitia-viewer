import { protocol } from 'electron';
import * as fs from 'fs';

import { PathService } from './services';
import { MetadataResourceType } from './models';


const pathService = new PathService();

export function createProtocol() {
  const getFilePath = (url: string, type: MetadataResourceType) => url.substring(type.length + 3);

  protocol.registerFileProtocol(MetadataResourceType.File, (request, callback) => {
    callback({
      path: getFilePath(request.url, MetadataResourceType.File)
    });
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })

  protocol.registerStreamProtocol(MetadataResourceType.Stream, (request, callback) => {
    callback(fs.createReadStream(getFilePath(request.url, MetadataResourceType.Stream)));
  }, (error) => {
    if (error) console.error('Failed to register protocol')
  })
}